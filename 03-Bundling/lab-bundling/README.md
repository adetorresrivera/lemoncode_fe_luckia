# Lab 03 · Bundling con Vite

La tienda de _Tueste_ montada con Vite **a mano**, desde un `package.json`
vacío (sin `npm create vite`): Sass, imágenes, TypeScript con comprobación de
tipos, React y variables de entorno.

<!-- TODO (obligatorio 7): este README se completa al final con las
     respuestas, capturas, la salida de npm run build, el checklist y la
     bitácora de IA. -->

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. La primera vez, el contenedor (Node 24) clona el repo en el volumen de
   Docker `lemoncode-fe-luckia` e instala las dependencias de todos los
   laboratorios (`postCreateCommand`).
   Si el contenedor ya existía de antes del lab 3, haz *Dev Containers:
   Rebuild Container* (para pasar a Node 24 y reenviar el puerto 4173) o, como
   mínimo, instala a mano:
   ```bash
   cd 03-Bundling/lab-bundling
   npm install
   ```
3. En la terminal del contenedor:
   ```bash
   cd 03-Bundling/lab-bundling
   npm start
   ```
4. Abre http://localhost:5173. VS Code reenvía los puertos 5173 (desarrollo)
   y 4173 (preview) del contenedor a tu máquina.

### En local (Node 20.19+; recomendado 24)
```bash
cd 03-Bundling/lab-bundling
npm install
npm start
```

### Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo de Vite en http://localhost:5173: sirve los ficheros sin empaquetar, transformados al vuelo, con HMR |
| `npm run build` | Genera la versión de producción en `dist/`: empaquetada, minificada y con hash en los nombres |
| `npm run preview` | Sirve la carpeta `dist/` ya construida en http://localhost:4173, para comprobar la versión de producción |
