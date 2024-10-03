import React, { useState, useEffect } from "react";
import "./popup.css";
import ikeaLogo from "./ikeaLogo.png"

const Popup: React.FC = () => {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        depth: 0,
    });
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // Load saved dimensions from local storage
        const saveDimensions = localStorage.getItem("fitFinderDimensions");
        if (saveDimensions) {
            setDimensions(JSON.parse(saveDimensions));
        }
    }, []);
    
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = e.target;
         const newDimensions = { ...dimensions, [name]: parseInt(value) || 0 };
         setDimensions(newDimensions);
         // Save dimensions to local storage
         localStorage.setItem(
             "fitFinderDimensions",
             JSON.stringify(newDimensions)
         );
     };

     const applyFilter = ()=> {
        if(dimensions.width === 0 && dimensions.height === 0 && dimensions.depth === 0){
            setError("You must enter at least one parameter");
            return;
        }
        setError(null);
        sendMsgToContentScript("filterProducts", dimensions);

     }

     const resetDimensions = () => {
        const resetDimensions = {width: 0, height: 0, depth: 0};
        setDimensions(resetDimensions);
        localStorage.removeItem("fitFinderDimensions");
        setError(null);
        sendMsgToContentScript("resetFilter")
     };

     const sendMsgToContentScript = (action: string, dimensions?: {width:number; height: number; depth: number})=>{
        if (chrome?.tabs?.query) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.id) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: action,
                            dimensions: dimensions,
                        },
                        (response) => {
                            console.log(
                                "Response from content script",
                                response
                            );
                            if (chrome.runtime.lastError) {
                                console.error(
                                    "Error",
                                    chrome.runtime.lastError
                                );
                                setError(
                                    "Error communicating with the page. Please refresh and try again."
                                );
                            }
                        }
                    );
                } else {
                    console.error("No active tab found");
                    setError("No active tab found");
                }
            });
        } else {
            console.error("Chrome API not available");
            setError("Chrome API not available");
        }
     }

    return (
        <div className="popup">
            <div className="header">
                <header>
                    <a
                        href="http://www.ikea.com"
                        target="_blank"
                        className="logo"
                    >
                        FitFinder
                        <img
                            className="imgHeader"
                            src={ikeaLogo}
                            alt="ikeaLogo"
                        />
                    </a>
                </header>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="inputs">
                <div className="input-container">
                    <label htmlFor="width">Width</label>
                    <input
                        type="number"
                        name="width"
                        id="width"
                        placeholder="Max Width"
                        value={dimensions.width || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="height">Hight</label>
                    <input
                        type="number"
                        name="height"
                        id="height"
                        placeholder="Max Height"
                        value={dimensions.height || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="depth">Depth</label>
                    <input
                        type="number"
                        name="depth"
                        id="depth"
                        placeholder="Max Depth"
                        value={dimensions.depth || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="btns">
                    <button className="btnFilter" onClick={applyFilter}>
                        Filter
                    </button>
                    <button className="btnReset" onClick={resetDimensions}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
