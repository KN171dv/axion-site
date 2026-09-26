import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// BASE permite gerar um build com caminhos relativos (ex.: BASE=./ para preview estático).
export default defineConfig({
  base: process.env.BASE ?? "/",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/react")) return "react";
        },
      },
    },
  },
});
