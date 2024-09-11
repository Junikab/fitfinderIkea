import React, { useState, useEffect } from "react";
import "./popup.css";

interface Product {
    name: string;
    width: number;
    height: number;
    depth?: number;
    price: number;
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
         setDimensions((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
     };

     const filterProducts = () => {
         const filtered = products.filter((product) => {
             const widthCheck = product.width <= dimensions.width;
             const heightCheck = product.height <= dimensions.height;
             const depthCheck =
                 !product.depth || product.depth <= dimensions.depth;
             return widthCheck && heightCheck && depthCheck;
         });
         setFilteredProducts(filtered);
     };

    return (
        <div className="popup">
            <h1>FitFinder IKEA </h1>
            {error && <div className="error">{error}</div>}
            <div className="inputs">
                <input
                    type="number"
                    name="width"
                    placeholder="Max Width"
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="height"
                    placeholder="Max Height"
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="depth"
                    placeholder="Max Depth"
                    onChange={handleInputChange}
                />
                <button onClick={filterProducts}>Filter</button>
            </div>
            <div className="results">
                {filteredProducts.map((product, index) => (
                    <div key={index} className="product">
                        <h3>{product.name}</h3>
                        <p>
                            Dimensions: {product.width}x{product.height}
                            {product.depth ? `x${product.depth}` : ""} cm
                        </p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Popup;
