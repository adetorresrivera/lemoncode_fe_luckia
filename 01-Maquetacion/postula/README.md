# Postula · Lab 01 (Maquetación)

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. Las dependencias se instalan solas (`postCreateCommand`).
3. En la terminal del contenedor:
   ```bash
   cd 01-Maquetacion/postula
   npm run dev
   ```
4. Abre http://localhost:5173

### DevContainer en Windows: avisos

Si el repo está clonado en Windows (por ejemplo en `C:\...`) y se abre con *Reopen in Container*, la carpeta se monta dentro del contenedor Linux. Eso tiene algunos efectos:

- **Finales de línea.** El `.gitattributes` de la raíz (`* text=auto eol=lf`) obliga a usar LF tanto en Windows como en el contenedor. No hace falta cambiar `core.autocrlf`.
- **`git status` muestra ficheros modificados sin cambios reales.** Pasa al alternar Git para Windows (GitHub Desktop, terminal de Windows) con el git del contenedor: cada uno guarda en `.git/index` metadatos distintos de los ficheros (fecha, inodo). Se corrige con `git add <fichero>`, que no cambia el contenido. Para evitarlo, usa git solo desde el contenedor.
- **Rendimiento y recarga en caliente.** El acceso a disco es más lento y Vite puede no detectar cambios hechos desde Windows. Si la página no se recarga sola, añade `watch: { usePolling: true }` dentro de `server` en `vite.config.js`.

La opción más fiable es clonar el repo directamente en un volumen del contenedor: *Dev Containers: Clone Repository in Container Volume…* y pegar la URL del repo. Así el código vive en Linux y ninguno de estos problemas aparece.

### En local (Node 20+)
```bash
cd 01-Maquetacion/postula
npm install
npm run dev
```

## Integración de Tailwind
Plugin `@tailwindcss/vite`: el proyecto ya es Vite, así que hay menos dependencias, no hace falta `postcss.config` y la recarga es más rápida. PostCSS solo compensaría si usáramos otros plugins de PostCSS o una herramienta distinta de Vite.
