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
    base: "/unsprint-twitch/",
    define: {
      // Enable legacy env variables for compatibility
      "process.env": {},
      // Expose .env as import.meta.env instead of process.env
      // This is important for Vite
    },
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: "dist",
    },
  };
});
