import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const BASE_URL = process.env.VITE_BASE_URL || "/unsprint-twitch/";

  console.log(`Set BASE_URL=${BASE_URL}`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    // For GitHub Pages deployment
    base: BASE_URL,
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: "dist",
    },
  };
});
