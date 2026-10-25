# Lab 02 · Lenguajes (katas de JavaScript y TypeScript)

## Cómo arrancarlo

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. La primera vez, el contenedor crea el volumen de Docker `lemoncode-fe-luckia`,
   **clona el repo de GitHub dentro** (`onCreateCommand`) e instala las
   dependencias de todos los laboratorios (`postCreateCommand`).
   Si el contenedor ya existía de antes del lab 2, instálalas a mano con
   `npm install` dentro de `02-Lenguajes/lab-lenguajes`.
3. En la terminal del contenedor:
   ```bash
   cd 02-Lenguajes/lab-lenguajes
   npm run dev
   ```
4. Abre http://localhost:5173 y la consola de DevTools (`F12` → *Console*):
   ahí sale todo lo que hacen las katas con `console.log`.

Otros comandos, desde `02-Lenguajes/lab-lenguajes`:

| Comando | Qué hace |
|---|---|
| `npm run katas` | Ejecuta `src/main.ts` con `tsx` y muestra la salida en la terminal, sin navegador |
| `npx tsc` | Comprueba los tipos. Vite no lo hace: quita los tipos y ejecuta aunque haya errores. Si no muestra nada, no hay errores |

### En local (Node 20+)
```bash
cd 02-Lenguajes/lab-lenguajes
npm install
npm run dev      # o npm run katas para verlo en la terminal
npx tsc
```
