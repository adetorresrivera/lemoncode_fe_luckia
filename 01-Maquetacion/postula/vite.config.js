import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Rutas absolutas a cada página: npm run build solo genera las que aparecen aquí
const page = (path) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  plugins: [tailwindcss()],
  // Escucha en 0.0.0.0 para que el puerto sea accesible desde fuera del DevContainer
  server: { host: true },
  preview: { host: true },
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        panel: page("./app/panel.html"),
        candidaturas: page("./app/candidaturas.html"),
        kanban: page("./app/kanban.html"),
      },
    },
  },
});
