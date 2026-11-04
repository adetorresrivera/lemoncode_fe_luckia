# Lab 04 · React

El catálogo de _Tueste_ con React: lista con buscador y carrito, detalle de
cada café y formularios de alta y edición. Parte de la demo
`01-de-javascript-a-react/demos/02-react` del módulo (Vite 8, TypeScript,
React 19 y Tailwind 4 ya configurados).

## Cómo arrancarlo

Necesita Node.js 22.12 o superior.

### Con DevContainer (recomendado)
1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. Al crear el contenedor se instalan las dependencias de todos los
   laboratorios, este incluido (`postCreateCommand`). Si el contenedor ya
   existía de antes del lab 4, haz *Dev Containers: Rebuild Container* o
   instala a mano con `npm install` dentro de `04-Frameworks/lab-react`.
3. En la terminal del contenedor:
   ```bash
   cd 04-Frameworks/lab-react
   npm start
   ```
4. Abre http://localhost:5173 (VS Code reenvía el puerto del contenedor).

### En local
```bash
cd 04-Frameworks/lab-react
npm install
npm start
```

### Scripts
| Script | Qué hace |
| --- | --- |
| `npm start` | Servidor de desarrollo de Vite en http://localhost:5173. Con `--host` escucha en todas las interfaces (`0.0.0.0`) y no sólo en `[::1]`, para que el reenvío de puertos del DevContainer llegue (ver bitácora del lab 3, entrada 1) |
| `npm run build` | Comprueba los tipos con `tsc --noEmit` y genera `dist/` con `vite build` |
| `npm run typecheck` | Sólo la comprobación de tipos |
| `npm run preview` | Sirve `dist/` en http://localhost:4173, también con `--host` |

## Datos de partida
- `public/coffees.json`: los 6 cafés iniciales (se piden con `fetch` a partir de O3).
- `src/model.ts`: los tipos `Roast`, `Coffee` y `CoffeeInput`.

## Estado
- [ ] O1 · El catálogo con componentes
- [ ] O2 · Un carrito con estado y eventos
- [ ] O3 · Cargar los cafés con useEffect
- [ ] O4 · Un custom hook y una ref
- [ ] O5 · Lista y detalle con TanStack Router
- [ ] O6 · Alta de cafés con TanStack Form y Zod
- [ ] O7 · Edición y organización en pods
- [ ] O8 · README + bitácora de IA
