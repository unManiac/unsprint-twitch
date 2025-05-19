import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    // For GitHub Pages deployment
    base: process.env.VITE_BASE_URL || "/unsprint-twitch/",
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: "dist",
    },
  };
});
