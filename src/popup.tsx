import React, { useState, useEffect } from "react";
import "./popup.css";
import ikeaLogo from "./ikeaLogo.png"


interface Product {
    name: string;
    width?: number;
    height?: number;
    depth?: number;
    url: string;
}

const Popup: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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

        if (chrome?.tabs?.query) {
            chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs: chrome.tabs.Tab[]) => {
                    if (chrome.runtime.lastError) {
                        setError(`Error: ${chrome.runtime.lastError.message}`);
                        return;
                    }

                    const activeTab = tabs[0];
                    if (activeTab.id) {
                        chrome.tabs.sendMessage(
                            activeTab.id,
                            { action: "getProducts" },
                            (response: Product[]) => {
                                if (chrome.runtime.lastError) {
                                    setError(
                                        `Error: ${chrome.runtime.lastError.message}`
                                    );
                                    return;
                                }
                                setProducts(response);
                                setFilteredProducts(response);
                            }
                        );
                    } else {
                        setError("No active tab found");
                    }
                }
            );
        } else {
            setError("Chrome API not available");
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

     const filterProducts = () => {
         const filtered = products.filter((product) => {
             const widthCheck = !product.width || product.width <= dimensions.width;
             const heightCheck = !product.height || product.height <= dimensions.height;
             const depthCheck = !product.depth || product.depth <= dimensions.depth;
             return widthCheck && heightCheck && depthCheck;
         });
         setFilteredProducts(filtered);
     };

     const resetDimensions = () => {
        const resetDimensions = {width: 0, height: 0, depth: 0};
        setDimensions(resetDimensions);
        localStorage.removeItem("fitFinderDimensions");
     };

    return (
        <div className="popup">
            <div className="header">
                <header>
                    <a href="/ikea.com" className="logo">
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
                        placeholder="Max Depth"
                        value={dimensions.depth || ""}
                        onChange={handleInputChange}
                    />
                </div>
                <button className="btnFilter" onClick={filterProducts}>
                    Filter
                </button>
                <button className="btnReset" onClick={resetDimensions}>
                    Reset
                </button>
            </div>

            <div className="results">
                {filteredProducts.map((product, index) => (
                    <a
                        key={index}
                        className="product"
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h3>{product.name}</h3>
                        <p>
                            Dimensions: {product.width}x{product.height}
                            {product.depth ? `x${product.depth}` : ""} cm
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Popup;
