import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

function movePopupHtml() {
    return {
        name: "move-popup-html",
        closeBundle() {
            const srcPath = path.resolve(__dirname, "dist/popup.html");
            const destPath = path.resolve(__dirname, "dist/popup.html");
            if (fs.existsSync(srcPath) && srcPath !== destPath) {
                fs.renameSync(srcPath, destPath);
                console.log("Moved popup.html to dist root");
            }
        },
    };
}

function copyCssFile() {
    return {
        name: "copy-css-file",
        writeBundle() {
            const srcPath = path.resolve(__dirname, "src/popup.css");
            const destPath = path.resolve(__dirname, "dist/popup.css");
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log("Copied popup.css to dist folder");
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
        copyCssFile(),
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, "index.html"),
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