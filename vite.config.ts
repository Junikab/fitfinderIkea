import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                popup: "src/popup.html",
                contentScript: "src/contentScript.ts",
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
});
