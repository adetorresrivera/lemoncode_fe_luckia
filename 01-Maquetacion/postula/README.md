# Postula · Lab 01 (Maquetación)

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. La primera vez, el contenedor crea el volumen de Docker `lemoncode-fe-luckia`,
   **clona el repo de GitHub dentro** (`onCreateCommand`) e instala las
   dependencias (`postCreateCommand`).
3. En la terminal del contenedor:
   ```bash
   cd 01-Maquetacion/postula
   npm run dev
   ```
4. Abre http://localhost:5173

### Dónde está el código

El contenedor **no monta la carpeta de Windows**: trabaja sobre su propia copia
clonada en un volumen Linux (`/workspaces/lemoncode_fe_luckia`). Así se evitan
los problemas de montar `C:\...` en Linux (git marcando ficheros como
modificados sin cambios reales, finales de línea, recarga lenta de Vite).

Consecuencias:

- Lo que edites en el contenedor **no aparece en la carpeta de Windows** (ni al
  revés). Para sincronizar, usa git: `commit` + `push` en el contenedor y
  `pull` donde lo necesites.
- Haz commits y push desde el contenedor; VS Code le pasa tus credenciales y tu
  `user.name` / `user.email`.
- El volumen persiste aunque reconstruyas el contenedor (*Rebuild Container*):
  no se vuelve a clonar ni pierdes cambios sin subir. Para empezar de cero,
  borra el volumen: `docker volume rm lemoncode-fe-luckia`.

### En local (Node 20+)
```bash
cd 01-Maquetacion/postula
npm install
npm run dev
```

## Integración de Tailwind
Plugin `@tailwindcss/vite`: el proyecto ya es Vite, así que hay menos dependencias, no hace falta `postcss.config` y la recarga es más rápida. PostCSS solo compensaría si usáramos otros plugins de PostCSS o una herramienta distinta de Vite.
