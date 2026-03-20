import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // SOSTITUISCI 'nome-del-tuo-repo' CON IL NOME ESATTO DEL TUO REPOSITORY GITHUB
  base: "/intuit-stock-pro/", 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
