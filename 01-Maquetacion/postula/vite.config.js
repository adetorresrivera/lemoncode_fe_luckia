import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // Escucha en 0.0.0.0 para que el puerto sea accesible desde fuera del DevContainer
  server: { host: true },
  preview: { host: true },
});
