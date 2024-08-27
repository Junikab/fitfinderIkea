import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

function movePopupHtml() {
    return {
        name: "move-popup-html",
        closeBundle() {
            const srcPath = path.resolve(__dirname, "dist/src/popup.html");
            const destPath = path.resolve(__dirname, "dist/popup.html");
            if (fs.existsSync(srcPath)) {
                fs.renameSync(srcPath, destPath);
                console.log("Moved popup.html to dist root");
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react(),
        {
            name: "copy-manifest",
            writeBundle() {
                fs.writeFileSync(
                    path.resolve(__dirname, "dist/manifest.json"),
                    JSON.stringify(require("./manifest.json"), null, 2)
                );
            },
        },
        movePopupHtml(),
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, "src/popup.html"),
                contentScript: path.resolve(__dirname, "src/contentScript.ts"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].[hash].js",
                assetFileNames: "[name].[ext]",
            },
        },
    },
});
