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
                    options: resolve(__dirname, "src/options.ts"),
                },
                output: {
                    entryFileNames: "[name].js",
                    assetFileNames: (assetInfo) => {
                        let path = "assets/[name][extname]";
                        if (assetInfo.names) {
                            assetInfo.names.forEach((name) => {
                                if (name.endsWith(".mp3")) {
                                    console.log(name + " is music");
                                    path = "assets/musics/[name][extname]";
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
