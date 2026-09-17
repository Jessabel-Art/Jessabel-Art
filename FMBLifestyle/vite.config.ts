import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const stableFaviconFiles = new Set([
  "apple-touch-icon.png",
  "favicon-96x96.png",
  "favicon.ico",
  "favicon.svg",
  "site.webmanifest",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/fmbl/",
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const assetName = assetInfo.name?.split(/[\\/]/).pop();
          if (assetName && stableFaviconFiles.has(assetName)) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
