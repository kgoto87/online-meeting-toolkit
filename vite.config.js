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
                    main: resolve(__dirname, "src/main.ts"),
                    background: resolve(__dirname, "src/background.ts"),
                    options: resolve(__dirname, "src/options/index.ts"),
                    optionsHtml: resolve(__dirname, "src/options/index.html"),
                },
                output: {
                    entryFileNames: (entryInfo) => {
                        let path = "[name].js";
                        if (entryInfo.name === "options") {
                            path = "options/index.js";
                        }
                        return path;
                    },
                    assetFileNames: (assetInfo) => {
                        let path = "assets/[name][extname]";
                        if (assetInfo.names) {
                            assetInfo.names.forEach((name) => {
                                if (name.endsWith(".mp3")) {
                                    path = "assets/musics/[name][extname]";
                                }
                                if (name === "options.css") {
                                    path = "options/options.css";
                                }
                            });
                        }
                        return path;
                    },
                },
            },
        },
    };
});
