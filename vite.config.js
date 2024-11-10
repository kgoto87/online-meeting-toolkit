import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig((opt) => {
    return {
        root: "src",
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                },
            },
        },
        build: {
            outDir: "../dist",
            rollupOptions: {
                input: {
                    index: resolve(__dirname, "src/index.ts"),
                    background: resolve(__dirname, "src/background.ts"),
                },
                output: {
                    entryFileNames: "[name].js",
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name.endsWith(".mp3")) {
                            return "assets/musics/[name][extname]";
                        }
                        return "assets/[name][extname]";
                    },
                },
            },
        },
    };
});
