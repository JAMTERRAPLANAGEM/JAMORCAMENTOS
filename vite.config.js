import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/JAMORCAMENTOS/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          xlsx: ["xlsx-js-style"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
