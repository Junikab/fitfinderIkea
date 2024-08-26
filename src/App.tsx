import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [depth, setDepth] = useState("");

    const handleFilter = () => {
        // TODO: Implement filtering logic
        console.log(`Filtering for dimensions: ${width}x${height}x${depth}`);
    };

    return (
        <div className="App">
            <h1>IKEA Furniture Filter</h1>
            <input
                type="number"
                placeholder="Width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
            />
            <input
                type="number"
                placeholder="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
            />
            <input
                type="number"
                placeholder="Depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
            />
            <button onClick={handleFilter}>Filter</button>
        </div>
    );
};

export default App;
