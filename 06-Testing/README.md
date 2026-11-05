# Lab 06 · Testing

Tests con Vitest y Testing Library sobre un trozo ya escrito del catálogo de
Tueste (carrito, llamada a la API, tarjeta de café, hook `useCart` y el
catálogo completo), en `lab-testing/src/catalog`.

## Cómo arrancarlo

Necesita Node.js 22.12 o superior (lo pide Vite 8: `^20.19.0 || >=22.12.0`;
el `package.json` del `.start-code` no tiene `engines`). El DevContainer usa la
imagen `javascript-node:24`; el contenedor en el que se preparó este lab es
de antes de cambiar la imagen y tiene Node 22.23.4 (`node -v`). Al
reconstruirlo se usa la 24.

### Con DevContainer (recomendado)

1. Abre la raíz del repo en VS Code → *Dev Containers: Reopen in Container*.
2. Al crear el contenedor, el `postCreateCommand` instala las dependencias de
   todos los laboratorios, y en este, las de `06-Testing/lab-testing` (sólo si
   existe su `package.json`).
3. Si el contenedor es de antes del lab 6, esas dependencias no están. Haz
   *Dev Containers: Rebuild Container*, o instálalas a mano:
   ```bash
   cd 06-Testing/lab-testing
   npm install
   ```
4. Los tests no usan ningún puerto. `npm start` (heredado del `.start-code`:
   `vite --open` + `tsc --watch`) usa el 5173, que ya está en `forwardPorts`.

Las versiones instaladas son las del `package-lock.json`: React 19.2.7,
TypeScript 6.0.3 y Vite 8.1.0. `npm install` avisa de 8 vulnerabilidades en
dependencias del `.start-code` (axios, Vite 8.1.0 y transitivas). No se ha
lanzado `npm audit fix`, porque cambiaría las versiones del proyecto de
partida.

### Comprobar los tipos

```bash
cd 06-Testing/lab-testing
npm run type-check
```

Es `tsc --noEmit`: comprueba los tipos de todo `src/` sin generar nada. Si no
hay errores, no muestra nada.

## Arreglos del proyecto de partida

Los dos que pide el enunciado, para que `npm run type-check` salga limpio. No
se ha tocado nada más del `.start-code`.

1. **`tsconfig.json`: `"module": "esnext"` y `"moduleResolution": "bundler"`**
   (antes, los dos en `"nodenext"`). Con `nodenext`, TypeScript resuelve los
   imports como lo hace Node con ES modules (y el `package.json` tiene
   `"type": "module"`): Node no adivina extensiones, así que un import
   relativo tiene que llevar la extensión del fichero que habrá en tiempo de
   ejecución, `./app.js` (aunque en disco sea `app.tsx`). Sin ella, error
   TS2835. Además, según el enunciado, con `nodenext` TypeScript no reconoce
   bien los tipos de `@testing-library/user-event` (se instala en O1). Aquí quien resuelve los imports no es Node
   sino Vite (y Vitest), que sí acepta `./app` sin extensión: `bundler` le
   dice a TypeScript que resuelva como un bundler, igual que en los
   laboratorios 3 y 4.
2. **`src/index.tsx`: `document.getElementById('root')!`**.
   `getElementById` devuelve `HTMLElement | null` (puede no haber ningún
   elemento con ese id), y `createRoot` pide un `Container`
   (`Element | DocumentFragment | Document`, en
   `@types/react-dom/client.d.ts`), en el que no cabe `null`. Desde
   TypeScript 6, `strict` viene activado por defecto, y con él
   `strictNullChecks`. El `!` (non-null assertion) le dice a TypeScript "aquí
   no es `null`"; es cierto porque `index.html` tiene `<div id="root">`.

### Comprobado

Con los dos arreglos, `npm run type-check` sale limpio, con código 0:
[docs/o0-type-check.txt](docs/o0-type-check.txt).

Sin ellos, en una copia del proyecto fuera del repo (con el `tsconfig.json`
original y sin el `!`), `tsc --noEmit` da 14 errores:

- 12 × TS2835 (`Relative import paths need explicit file extensions … Did you
  mean './model.js'?`), uno por cada import relativo de `src/`.
- 1 × TS2307 en `import { getCoffees } from './coffee.api'`: con `nodenext`,
  TypeScript no encuentra el módulo y ni siquiera propone el `.js`.
- 1 × TS2345 en `src/index.tsx(5,25)`: `Argument of type 'HTMLElement | null'
  is not assignable to parameter of type 'Container'`.

En el `tsconfig.json` no aparece `strict`, y aun así sale el TS2345: está
activado por defecto. Lo que sí está desactivado es `noImplicitAny` (`false`
en el `tsconfig.json` del `.start-code`), así que `tsc` no avisa de un
parámetro sin tipo.

## Estructura

```
06-Testing/
├── lab.md            ← enunciado
├── prompts.md        ← los prompts de Claude Code, uno por obligatorio
├── README.md         ← este fichero
├── bitacora.md       ← bitácora de IA
├── docs/             ← salidas de type-check y vitest (.txt) que prueban cada paso
└── lab-testing/      ← copia de 06-testing/.start-code (React + TypeScript + Vite)
    ├── index.html    ← <div id="root"> y carga src/index.tsx
    ├── package.json  ← scripts start y type-check
    ├── tsconfig.json ← con los dos arreglos de arriba
    └── src/
        ├── index.tsx ← monta <App /> en #root
        ├── app.tsx   ← componente de ejemplo del .start-code (sólo un <h1>)
        └── catalog/  ← el código que se prueba, copiado tal cual del enunciado
            ├── model.ts           ← interfaces Coffee y CartItem
            ├── cart.ts            ← funciones puras: formatPrice, finalPrice, addToCart, removeFromCart, cartTotal
            ├── coffee.api.ts      ← getCoffees: fetch a /api/coffees y un error por cada estado
            ├── coffee-card.tsx    ← CoffeeCard: nombre, origen, precio, descuento y botón Añadir
            ├── use-cart.ts        ← useCart: estado del carrito, units, total, add, remove y clear
            ├── coffee-catalog.tsx ← CoffeeCatalog: carga, error, buscador y carrito (no se monta en index.tsx)
            └── test-data.ts       ← los tres cafés de prueba que usan todos los tests
```

## Checklist

### Obligatorios
- [ ] O1 · Configurar Vitest
- [ ] O2 · Funciones puras: el carrito
- [ ] O3 · Código asíncrono: la llamada a la API
- [ ] O4 · Un componente presentacional: la tarjeta
- [ ] O5 · Un componente con datos: el catálogo
- [ ] O6 · Un custom hook: useCart
- [ ] O7 · README + bitácora de IA

### Opcionales
- [ ] P1 · Cobertura
- [ ] P2 · Snapshots: a favor y en contra
- [ ] P3 · Temporizadores falsos
- [ ] P4 · Context: un carrito compartido
- [ ] P5 · Probad vuestro laboratorio de React
- [ ] P6 · Depurar un test

### Desafíos
- [ ] D1 · TDD: primero el test
- [ ] D2 · Simular la red con MSW
- [ ] D3 · Los tests en cada push
