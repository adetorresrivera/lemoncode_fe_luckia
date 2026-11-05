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

Es `tsc --noEmit`: comprueba los tipos de todo `src/` (specs incluidos) y de
`config/test/config.d.ts` y `config/test/setup.ts`, sin generar nada. Si no
hay errores, no muestra nada.

### Tests

```bash
cd 06-Testing/lab-testing
npm test           # modo vigilancia
npm run test:run   # una vez y termina
```

- `npm test` es `vitest -c ./config/test/config.ts`. Ejecuta los tests y se
  queda esperando: cada vez que guardas un fichero, vuelve a ejecutar los
  tests afectados. Se sale con `q` (o `Ctrl+C`).
- `npm run test:run` es `vitest run -c ./config/test/config.ts`. Los ejecuta
  una vez y vuelve a la terminal, con código de salida 0 si todo pasa y 1 si
  algo falla. Equivale a `npx vitest run -c ./config/test/config.ts`.
- Si no hay ningún `*.spec.ts(x)` (como al acabar O1), Vitest dice `No test
  files found, exiting with code 1`. Es normal: los tests llegan en O2.

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

## O1 · Configurar Vitest

### Dependencias

Instaladas como `devDependencies` con
`npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event`:

| Paquete | Versión | Para qué |
| --- | --- | --- |
| `vitest` | 5.1.0 | El runner: `describe`, `it`, `expect`, `vi` |
| `jsdom` | 31.0.0 | Un DOM (`document`, `window`) dentro de Node |
| `@testing-library/react` | 16.3.3 | `render` y `screen` para componentes React |
| `@testing-library/dom` | 10.4.2 | Las consultas (`getByRole`…); `@testing-library/react` la pide como peer |
| `@testing-library/jest-dom` | 7.0.1 | Matchers de DOM: `toBeInTheDocument`, `toBeDisabled`… |
| `@testing-library/user-event` | 14.6.8 | Simula al usuario: `click`, `type`… |

Compatibilidad comprobada en los `peerDependencies` instalados:
`@testing-library/react` 16.3.3 pide `react`, `react-dom`, `@types/react` y
`@types/react-dom` `^18.0.0 || ^19.0.0` (hay React 19.2.7, `@types/react`
19.2.17 y `@types/react-dom` 19.2.3) y `@testing-library/dom` `^10.0.0`.
Vitest 5.1.0 pide `vite ^6.4.0 || ^7.0.0 || ^8.0.0` (hay 8.1.0) y Node
`^22.12.0 || ^24.0.0 || >=26.0.0`. jsdom 31 pide Node
`^22.22.2 || ^24.15.0 || >=26.0.0`: el contenedor actual tiene 22.23.4, que
cumple por poco, y la imagen del DevContainer trae la 24. `npm ls` no da
ningún peer sin cumplir. El aviso de 8 vulnerabilidades es el mismo de antes
(dependencias del `.start-code`).

### `config/test/config.ts`

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    environment: 'jsdom',
    setupFiles: ['./config/test/setup.ts'],
  },
});
```

- `defineConfig` de `vitest/config` (no de `vite`): es el mismo de Vite, pero
  con los tipos de la clave `test`.
- `globals: true`: Vitest crea `describe`, `it`, `expect`, `vi`… como
  variables globales, y los specs no tienen que importarlos de `vitest`.
  Sólo afecta a la ejecución; los tipos los da `config.d.ts`.
- `restoreMocks: true`: antes de cada test, Vitest llama a
  `vi.restoreAllMocks()`, que devuelve el método original a todo lo
  espiado con `vi.spyOn`. Ver la respuesta de O1 y
  [docs/o1-restore-mocks.txt](docs/o1-restore-mocks.txt).
- `environment: 'jsdom'`: cada fichero de test se ejecuta con un DOM
  simulado (`document`, `window`, `HTMLElement`…). Por defecto es `'node'`,
  sin DOM. Ver [docs/o1-sin-jsdom.txt](docs/o1-sin-jsdom.txt).
- `setupFiles`: ficheros que se ejecutan antes de cada fichero de test. La
  ruta se resuelve desde la raíz del proyecto (la carpeta en la que se lanza
  `vitest`, `lab-testing/`), no desde `config/test/`. Por eso es
  `./config/test/setup.ts` y no `./setup.ts`.
- **Sin el plugin de React.** `-c ./config/test/config.ts` sustituye a
  `vite.config.ts`, que no se carga, así que `plugins: [react()]` no llega a
  los tests. Lo he comprobado con dos componentes temporales. Sin plugin,
  Vite 8 (Oxc) aplica el `"jsx": "react"` del `tsconfig.json`, es decir, el
  runtime clásico: un `.tsx` que no importa React, incluido el propio spec,
  da `ReferenceError: React is not defined`. Con `plugins: [react()]`
  funcionaban los dos. No hace falta: todo `src/catalog` ya importa React, y
  `tsc` con `jsx: react` exige lo mismo (sin el import da `TS2686: 'React'
  refers to a UMD global`). Así Vitest y `tsc` aplican la misma regla, y los
  specs `.tsx` llevarán `import React from 'react'`.

### `config/test/setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
```

Al ejecutar, añade los matchers de jest-dom (`toBeInTheDocument`,
`toHaveTextContent`…) al `expect` de Vitest. En el type-check, el mismo
import trae `@testing-library/jest-dom/types/vitest.d.ts`, que amplía la
interfaz `Assertion` de `vitest` con esos matchers. Por eso `setup.ts` tiene
que estar en el `include`: sin él, `tsc` da `Property 'toBeInTheDocument'
does not exist on type 'Assertion<…>'` (comprobado).

### `config/test/config.d.ts`

```ts
/// <reference types="vitest/globals" />
```

Sólo actúa en el type-check. Carga `node_modules/vitest/globals.d.ts`, que
declara `describe`, `it`, `expect`, `vi`, `beforeEach`… como globales con
los tipos de `vitest`. Es lo que corresponde a `globals: true`: una cosa los
crea al ejecutar y la otra le dice a TypeScript que existen. Sin ella, un
spec da `TS2593: Cannot find name 'describe'` y `TS2304: Cannot find name
'vi'` / `'expect'` (comprobado). La otra opción válida era
`"types": ["vitest/globals"]` en `compilerOptions` (la que muestra el README
de jest-dom). También sale limpia, pero dejaría vacío el `config.d.ts` que
pide el enunciado.

### `tsconfig.json` y `package.json`

```json
"include": [
  "./src/**/*",
  "./config/test/config.d.ts",
  "./config/test/setup.ts"
]
```

`./src/**/*` ya cubre los futuros `src/**/*.spec.ts(x)`: un spec de prueba
en `src/` sin `config.d.ts` daba los errores de arriba, así que `tsc` lo
estaba comprobando. `config/test/config.ts` no está en el `include`, igual
que `vite.config.ts` en el `.start-code`.

Scripts nuevos: `"test": "vitest -c ./config/test/config.ts"` y
`"test:run": "vitest run -c ./config/test/config.ts"`.

### Comprobado

- [docs/o1-dummy.txt](docs/o1-dummy.txt): `src/dummy.spec.ts` con un test
  que pasa y otro que falla a propósito → `Tests  1 failed | 1 passed (2)`,
  código de salida 1. Con el dummy, `npm run type-check` salió limpio.
- [docs/o1-sin-jsdom.txt](docs/o1-sin-jsdom.txt): al dummy se le añadió un
  test que crea un `<p>` con `document.createElement` y lo comprueba con
  `toBeInTheDocument`. Con `jsdom` pasaba (`1 failed | 2 passed (3)`). Con
  `environment: 'node'` (temporal) falla con `ReferenceError: document is
  not defined` (`2 failed | 1 passed (3)`).
- [docs/o1-restore-mocks.txt](docs/o1-restore-mocks.txt): el spec temporal
  de `restoreMocks`, en tres configuraciones.
- `src/dummy.spec.ts` y el spec temporal están borrados; `config.ts` vuelve a
  tener `environment: 'jsdom'` y `restoreMocks: true`.

Vitest 5 detecta si lo lanza un agente de IA (variables `AI_AGENT`,
`CLAUDECODE`) y entonces usa el reporter `minimal`. Las salidas de `docs/`
se generaron sin esas variables (`env -u AI_AGENT -u CLAUDECODE …`), para
que se vean como en tu terminal, con el reporter `default`.

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
    ├── package.json  ← scripts start, type-check, test y test:run
    ├── tsconfig.json ← con los dos arreglos de arriba; include con config/test
    ├── config/test/
    │   ├── config.ts   ← configuración de Vitest (globals, restoreMocks, jsdom, setupFiles)
    │   ├── config.d.ts ← tipos de los globals de Vitest para tsc
    │   └── setup.ts    ← carga los matchers de jest-dom antes de cada fichero de test
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
- [x] O1 · Configurar Vitest
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

## Respuestas

### O1

**¿Para qué sirve `environment: 'jsdom'`? ¿Qué pasaba en la demo 05 sin él?**

Vitest ejecuta los tests en Node, y Node no tiene navegador: no existen
`document`, `window` ni `HTMLElement`. `environment: 'jsdom'` crea antes de
cada fichero de test un DOM simulado con jsdom (un navegador escrito en
JavaScript, sin pantalla), y deja `document`, `window`… como globales. Es lo
que necesitan `render` de Testing Library (monta el componente en
`document.body`), `screen` (consulta ese `document`), `userEvent` (lanza
eventos sobre él) y los matchers de jest-dom.

Sin él, el entorno por defecto es `'node'`, y lo que toca el DOM revienta. Lo
he comprobado con el dummy
([docs/o1-sin-jsdom.txt](docs/o1-sin-jsdom.txt)): con `environment: 'node'`,
el test que hace `document.createElement('p')` falla con `ReferenceError:
document is not defined` en esa línea. Los tests que no tocan el DOM siguen
igual: el que pasaba pasa y el que fallaba a propósito falla. En la demo 05
pasaría lo mismo con `render(<Componente />)`: en cuanto Testing Library
intenta usar `document`, `document is not defined`. Los tests de funciones
puras (O2) o de `getCoffees` (O3) funcionarían sin jsdom, pero en un único
config para todo el proyecto lo que manda son los componentes.

**¿Qué hace `restoreMocks: true` y qué problema evita entre un test y el siguiente?**

Antes de cada test, Vitest llama a `vi.restoreAllMocks()`
(`clearModuleMocks` en `vitest/dist`). En la 5.1.0, eso sólo recorre los
mocks creados con `vi.spyOn` y le devuelve a cada objeto su método original
(`Math.random` vuelve a ser el de verdad). El comentario de la opción en los
tipos dice "Will call `.mockRestore()` on all spies", y `mockRestore()` sí
borraría las llamadas. Pero en el código de `@vitest/spy`, `restoreAllMocks`
sólo ejecuta el `restore` que registra `spyOn`: ni borra las llamadas
registradas ni resetea los `vi.fn()`. Lo he comprobado con un spec temporal
de dos tests ([docs/o1-restore-mocks.txt](docs/o1-restore-mocks.txt)). El
primero hace `vi.spyOn(Math, 'random').mockReturnValue(0.5)` y llama a un
`vi.fn()` (`onSave`) creado a nivel de módulo. El segundo llama cinco veces a
`Math.random` y espera que no salga siempre 0.5:

| Configuración | `Math.random` en el 2.º test | Llamadas de `onSave` que quedan | 2.º test |
| --- | --- | --- | --- |
| `restoreMocks: true` (la de O1) | el original (valores aleatorios) | 0 | ✓ |
| `restoreMocks: false` | sigue espiado: 0.5, 0.5, 0.5, 0.5, 0.5 | 0 | × |
| `restoreMocks: true` + `clearMocks: false` | el original | **1** | ✓ |

Las llamadas a 0 de las dos primeras filas no son cosa de `restoreMocks`,
sino de `clearMocks`, que en Vitest 5.1.0 viene a `true` por defecto (en
`defaults` de `vitest/dist`): antes de cada test hace `mockClear()` a todos
los mocks. Con `clearMocks: false`, aunque `restoreMocks` esté a `true`, la
llamada del primer test sigue ahí.

El problema que evita es el de los tests que dependen del orden. Un
`vi.spyOn` que no se restaura sigue activo en los tests siguientes del mismo
fichero. En la segunda fila, el segundo test falla sólo porque el primero se
ha ejecutado antes. Si lo ejecutas solo, pasa. Con `restoreMocks: true` cada
test empieza con los objetos reales, y la regla "ningún test depende de
otro" se cumple sin tener que escribir `mockRestore()` a mano en cada uno.
