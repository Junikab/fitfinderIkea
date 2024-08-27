import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

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
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
            },
        },
    },
});
