import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { slideEditor } from "./plugins/slide-editor";

export default defineConfig({
  base: "/RUNI/",
  plugins: [react(), slideEditor()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
