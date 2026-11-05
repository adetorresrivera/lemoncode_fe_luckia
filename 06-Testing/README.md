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
   El informe de cobertura de P1 se sirve en el 4173, que también lo está.

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
npm run test:coverage   # una vez, con la tabla de cobertura y el informe HTML (P1)
```

- `npm test` es `vitest -c ./config/test/config.ts`. Ejecuta los tests y se
  queda esperando: cada vez que guardas un fichero, vuelve a ejecutar los
  tests afectados. Se sale con `q` (o `Ctrl+C`).
- `npm run test:run` es `vitest run -c ./config/test/config.ts`. Los ejecuta
  una vez y vuelve a la terminal, con código de salida 0 si todo pasa y 1 si
  algo falla. Equivale a `npx vitest run -c ./config/test/config.ts`.
- Sólo los tests de MSW (D2): `npx vitest run -c ./config/test/config.ts msw`
  (el filtro `msw` selecciona los ficheros cuyo nombre lo contiene).
- Si no hay ningún `*.spec.ts(x)` (como al acabar O1), Vitest dice `No test
  files found, exiting with code 1`. Es normal: los tests llegan en O2.
- Todo esto se lanza desde la terminal de VS Code **dentro del
  DevContainer** (*Terminal → New Terminal* una vez abierto con *Reopen in
  Container*), y se comprueba antes con `npm run type-check` (arriba).

## Salida final de los tests

Después de `rm -rf node_modules && npm ci` (`added 301 packages`) y `npm run
type-check` (sin salida, código 0), en la terminal del DevContainer:
`NO_COLOR=1 npx vitest run -c ./config/test/config.ts`
([docs/vitest-final.txt](docs/vitest-final.txt), código de salida 0):

```
 RUN  v5.1.0 /workspaces/lemoncode_fe_luckia/06-Testing/lab-testing

 ✓ src/catalog/coffee.api.spec.ts (6 tests) 32ms
 ✓ src/catalog/cart.spec.ts (13 tests) 17ms
stderr | src/catalog/coffee-catalog.spec.tsx > CoffeeCatalog > carga > debería mostrar "Cargando…" cuando getCoffees todavía no ha respondido
Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

stderr | src/catalog/coffee-card.spec.tsx > CoffeeCard > debería mostrar el nombre del café como encabezado de nivel 3 cuando se pinta la tarjeta
Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

 ✓ src/catalog/use-cart.spec.ts (6 tests) 56ms
 ✓ src/catalog/coffee-card.spec.tsx (4 tests) 173ms
stderr | src/catalog/coffee-catalog.msw.spec.tsx > CoffeeCatalog (MSW) > carga > debería mostrar "Cargando…" cuando la API todavía no ha respondido
Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

 ✓ src/catalog/coffee.api.msw.spec.ts (6 tests) 133ms
 ✓ src/catalog/coffee-catalog.msw.spec.tsx (4 tests) 219ms
 ✓ src/catalog/coffee-catalog.spec.tsx (9 tests) 435ms

 Test Files  7 passed (7)
      Tests  48 passed (48)
   Start at  21:20:02
   Duration  1.87s (environment 65%, setup 14%, tests 11%, import 7%, transform 2%, worker 1%)
```

| Fichero | Tests | Obligatorio / opcional |
| --- | --- | --- |
| `cart.spec.ts` | 13 | O2 (12) + 1 de la revisión de O7 |
| `coffee.api.spec.ts` | 6 | O3 |
| `coffee-card.spec.tsx` | 4 | O4 |
| `coffee-catalog.spec.tsx` | 9 | O5 |
| `use-cart.spec.ts` | 6 | O6 (4) + P1 (2) |
| `coffee.api.msw.spec.ts` | 6 | D2 |
| `coffee-catalog.msw.spec.tsx` | 4 | D2 |

- **Los tres bloques `stderr` no son fallos ni avisos de los tests.** Es el
  mismo aviso de React en el primer render de cada fichero con JSX, por el
  `"jsx": "react"` (runtime clásico) del `tsconfig.json` del `.start-code`,
  que no se toca. Con `--silent=false` no aparece ningún otro: ni `not
  wrapped in act(...)`, ni `unique "key"`, ni `validateDOMNesting`, ni
  `[MSW]` (comprobado con `grep` sobre la salida).
- **Los tests no dependen del orden**
  ([docs/orden-aleatorio.txt](docs/orden-aleatorio.txt)): con
  `--sequence.shuffle` (baraja los ficheros y los tests de cada fichero) y
  las semillas 1, 2 y 3, `Tests  48 passed (48)` las tres veces; y cada
  fichero ejecutado solo, también en verde (13, 6, 4, 9, 6, 6 y 4).
- **El código del enunciado no ha cambiado.** `git diff --diff-filter=MDR
  --exit-code c2fc696 -- 06-Testing/lab-testing/src` (el commit del
  prompt 0, `L6 - Setup`) sale con código 0: desde entonces sólo hay
  ficheros nuevos (los 7 `*.spec.ts(x)` y `mocks/`). Y los 7 ficheros de
  `src/catalog` son idénticos, carácter a carácter, a los bloques de
  `lab.md` (comparados con un script que extrae cada bloque del enunciado).

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
`CLAUDECODE`) y entonces usa el reporter `minimal` en vez del `default`
(`reporters: [isAgent ? "minimal" : "default", …]` en
`node_modules/vitest/dist/chunks/defaults.*.js`). El `minimal` no lista los
tests que pasan y, si no se le pasa `--silent`, pone `silent =
"passed-only"`: esconde la consola (`stderr`) de los tests que pasan
(`cli-api.*.js`, clase `MinimalReporter`). Las salidas de `docs/` se
generaron sin esas variables (`env -u AI_AGENT -u CLAUDECODE …`), para que
se vean como en tu terminal, con el reporter `default`. Hay dos excepciones,
que salieron con el `minimal` (no tienen ninguna línea `✓`):
[docs/o4-verde.txt](docs/o4-verde.txt) y
[docs/o5-romper-2-sin-test.txt](docs/o5-romper-2-sin-test.txt). Ver la
entrada 13 de la bitácora.

## O2 · El carrito

Fichero `lab-testing/src/catalog/cart.spec.ts`: 13 tests, con un `describe`
por función (12 de O2 y uno de `removeFromCart` que se añadió en la revisión
de O7: ver "Preparación para la revisión"). Los cafés salen de `test-data.ts` (Etiopía 14.9 con `discount:
0.1`, Colombia 12.9 y Brasil 10.5, sin descuento). El único café inventado es
`{ ...colombia, discount: 0 }`, y se construye en el Arrange de su test. Cada
test escribe su propio carrito literal, así que ninguno depende de otro.

| `describe` | Test | Matcher |
| --- | --- | --- |
| formatPrice | debería devolver "14.90 €" cuando el precio es 14.9 | `toBe` |
| formatPrice | debería añadir los dos decimales cuando el precio es entero (10 → "10.00 €") | `toBe` |
| finalPrice | debería aplicar el descuento cuando el café tiene discount (Etiopía → 13.41) | `toBeCloseTo(13.41, 2)` |
| finalPrice | debería devolver el precio tal cual cuando el café no tiene discount (Colombia → 12.9) | `toBe` |
| finalPrice | debería devolver el precio tal cual cuando el discount es 0 | `toBe` |
| addToCart | debería añadir el café con cantidad 1 cuando el carrito está vacío | `toEqual` |
| addToCart | debería sumar 1 al café y dejar los demás igual cuando el café ya está en el carrito | `toEqual` |
| addToCart | no debería modificar el carrito que recibe cuando el café ya está en él | `toEqual` + `not.toBe` |
| removeFromCart | debería quitar el café indicado y dejar los demás cuando está en el carrito | `toEqual` |
| removeFromCart | no debería modificar el carrito que recibe cuando quita un café (O7) | `toEqual` + `not.toBe` |
| cartTotal | debería devolver 0 cuando el carrito está vacío | `toBe` |
| cartTotal | debería sumar los precios finales por cantidad cuando hay 2 × Etiopía y 1 × Brasil (37.32) | `toBeCloseTo(37.32, 2)` |
| cartTotal | debería contar como 0 un café cuando su coffeeId no existe en el catálogo | `toBe` |

### Por qué cada matcher

- **`toBe`** (`Object.is`) para los strings de `formatPrice` y para los
  números que salen exactos. `12.9 * (1 - 0)` es `12.9 * 1`, sin redondeo.
  `0` es el valor inicial del `reduce`. `10.5` es `0 + 10.5 * 1`. Si alguno
  no fuese exacto, el test se pondría rojo y se vería enseguida.
- **`toEqual`** para los carritos (arrays de objetos). Compara el contenido,
  recursivamente. Con `toBe` el test fallaría siempre, porque `addToCart` y
  `removeFromCart` devuelven un array nuevo y `Object.is` compara referencias.
- **`toBeCloseTo(x, 2)`** cuando hay que multiplicar decimales (el descuento
  de Etiopía y el total). Pasa si `|recibido − esperado| < 0.005`.
  Comprobado con `node -e`: con estos números el resultado sí es exacto.
  `14.9 * (1 - 0.1) === 13.41` da `true` (con `toPrecision(20)`, los dos son
  `13.410000000000000142`) y `2 × 13.41 + 10.5 === 37.32` también. En cambio,
  `0.1 + 0.2` da `0.30000000000000004`. Que el redondeo caiga justo en el
  double de `13.41` es casualidad. Con otro precio o descuento podría no
  pasar, y un test que dependa de eso es frágil. Ver la entrada 4 de la
  [bitácora](bitacora.md).
- **`toEqual` + `not.toBe` para la mutación.** El original se copia con
  `structuredClone`, que hace una copia profunda. Después se comprueba
  `expect(cart).toEqual(original)`: el carrito que se pasó sigue teniendo el
  mismo contenido, item a item. También se comprueba
  `expect(result).not.toBe(cart)`: lo devuelto es otro array. Cada uno detecta
  un fallo distinto (ver la tabla de 💥):
  - `toEqual` detecta que se **cambie algo dentro** del carrito (el 💥 1 suma
    1 al item original). Sólo funciona con la copia profunda. Con
    `[...cart]`, la copia es otro array pero con **los mismos objetos**, así
    que cuando `addToCart` muta el item cambia también la copia, y el
    `toEqual` sigue en verde. Comprobado con `node -e`: tras la mutación,
    la copia superficial quedó con `quantity: 3`, igual que `cart`, y la de
    `structuredClone` se quedó con `quantity: 2`.
  - `not.toBe` detecta que se **devuelva el mismo array** (por ejemplo, si
    `addToCart` lo hiciera con `push` y `return cart`). No detecta el 💥 1,
    porque `map` crea siempre un array nuevo aunque los items sean los
    originales.
  - El test añade un café **que ya está** en el carrito. Si añadiese uno
    nuevo, se ejecutaría la rama `[...cart, { coffeeId, quantity: 1 }]` y el
    código del 💥 1 no se ejecutaría.

### Comprobado

- [docs/o2-verde.txt](docs/o2-verde.txt): `Tests  12 passed (12)`, con
  `--reporter=verbose` para que salga el nombre de cada test.
  `npm run type-check` limpio.
- Los dos 💥 del enunciado, en la tabla de abajo. Además, para que cada test
  se vea fallar al menos una vez (los dos 💥 del enunciado sólo ponen en rojo
  3 de los 12), se hicieron 8 💥 más, uno cada vez y deshecho después:
  [docs/o2-romper-otros.txt](docs/o2-romper-otros.txt).

## O3 · La API

Fichero `lab-testing/src/catalog/coffee.api.spec.ts`: 6 tests (2 + 3 del
`it.each` + 1). No hay servidor. Cada test sustituye `fetch` con un spy sobre
el objeto global y decide qué devuelve:

```ts
vi.spyOn(globalThis, 'fetch').mockResolvedValue(
  new Response(JSON.stringify({ data: coffees }), { status }),
);
```

- **`globalThis`**, no `window`: `fetch` es una global de Node (Vitest corre
  en Node). Con jsdom también existe `window`, pero `globalThis` funciona en
  cualquier entorno.
- **`new Response(...)`**: es el `Response` de Node (undici), no el de jsdom.
  Antes de escribir los tests lo comprobé en el entorno jsdom con un spec
  temporal: `window` existe, `ok` es `false` con un 503, `status` es 503,
  `json()` devuelve `{ data: [1] }` y una segunda lectura rechaza con `Body
  is unusable`. Por eso **cada test crea su propio `Response`** dentro de su
  `it`: un cuerpo sólo se puede leer una vez.
- **Sin `beforeEach` ni `beforeAll`**: el mock está en el Arrange de cada
  test, y `restoreMocks: true` (O1) le devuelve a `globalThis` el `fetch`
  original al acabar cada uno.
- **Los rechazos** con `await expect(result).rejects.toThrow('…')`, donde
  `result = getCoffees()` es la promesa (sin `await`) que se crea en el Act.
  Nada de try/catch (ver 🪤 más abajo).

| `describe` | Test | Mock de `fetch` | Qué comprueba |
| --- | --- | --- | --- |
| cuando la API responde 200 | debería devolver los cafés del campo data cuando la API responde 200 | `mockResolvedValue(Response 200 con { data: coffees })` | `toEqual(coffees)`: devuelve el `data` (los tres cafés), no el objeto `{ data }` entero |
| cuando la API responde 200 | debería llamar a fetch una vez con "/api/coffees" y la cabecera Accept: application/json cuando se piden los cafés | el mismo | `toHaveBeenCalledTimes(1)` y `toHaveBeenCalledWith('/api/coffees', expect.objectContaining({ headers: { Accept: 'application/json' } }))` |
| cuando la API responde con un error | `it.each`: debería rechazar con "$message" cuando la API responde $status (×3) | `mockResolvedValue(Response con el status de la fila)` | `rejects.toThrow(message)` |
| cuando falla la red | debería propagar el TypeError "Failed to fetch" tal cual cuando fetch rechaza | `mockRejectedValue(new TypeError('Failed to fetch'))` | `rejects.toThrow(TypeError)` y `rejects.toThrow('Failed to fetch')` |

La tabla del `it.each` (con objetos, para que `$status` y `$message` se
interpolen en el nombre):

| `status` | `message` | Rama del `switch` |
| --- | --- | --- |
| 404 | Catálogo no encontrado | `case 404` |
| 503 | Servicio no disponible | `case 503` |
| 500 | Error inesperado | `default` (vale por cualquier otro estado) |

Decisiones:

- **El literal `'/api/coffees'`, no la constante `url` exportada.** Si
  alguien cambia `url` por error, un test que use la constante seguiría en
  verde, porque repetiría el error. El literal fija el contrato con el
  servidor (el 💥 de `url` en
  [docs/o3-romper-otros.txt](docs/o3-romper-otros.txt) lo pone en rojo).
- **`expect.objectContaining` en el segundo argumento.** Hoy la llamada exacta
  también casaría (`{ headers: { Accept: 'application/json' } }`). Con
  `objectContaining`, el test sigue en verde si un día se añade un `signal`
  (AbortController), pero se pone rojo si se quita o se cambia el `Accept`.
  Lo que se comprueba es la cabecera, no que no haya otras opciones.
- **Dos `toThrow` en el error de red.** `toThrow(TypeError)` comprueba el
  tipo y `toThrow('Failed to fetch')` el mensaje. Los dos se hacen sobre la
  misma promesa: una promesa ya rechazada se puede esperar varias veces, y
  así `fetch` se llama una sola vez. Hace falta el del tipo. En el último 💥
  de [docs/o3-romper-otros.txt](docs/o3-romper-otros.txt), el código
  envuelve el error de red en un `Error` con el mismo mensaje: el del
  mensaje seguiría en verde y sólo el del tipo lo detecta (`expected error to
  be instance of TypeError`).

### Comprobado

- [docs/o3-verde.txt](docs/o3-verde.txt): `Tests  18 passed (18)` (12 de O2 +
  6 de O3), con `--reporter=verbose`. `npm run type-check` limpio.
- El 💥 del enunciado, en la tabla de abajo, sólo pone en rojo el test del
  503. Para ver fallar los otros cinco, se hicieron 6 💥 más, uno cada vez y
  deshecho después: [docs/o3-romper-otros.txt](docs/o3-romper-otros.txt)
  (`return []`, `url`, `Accept`, mensaje del 404, mensaje del `default` y
  error de red envuelto). Cada uno pone en rojo exactamente un test.
- `expect(…).rejects` sin `await`:
  [docs/o3-sin-await.txt](docs/o3-sin-await.txt) (ver la respuesta 📝 de
  O3).

## O4 · La tarjeta

Fichero `lab-testing/src/catalog/coffee-card.spec.tsx`: 4 tests. Cada uno
hace su propio `render(<CoffeeCard coffee={…} onAdd={onAdd} />)` con un café
de `test-data.ts` (`ethiopia` = `coffees[0]`, con `discount: 0.1`;
`colombia` = `coffees[1]`, sin descuento) y busca con `screen`. Nada de
`container.querySelector`, clases ni snapshots.

| Test | Café | Consulta | Matcher |
| --- | --- | --- | --- |
| debería mostrar el nombre del café como encabezado de nivel 3 cuando se pinta la tarjeta | Etiopía | `getByRole('heading', { level: 3, name: 'Etiopía Yirgacheffe' })` | `toBeInTheDocument()` |
| debería mostrar el precio final con el descuento aplicado y la etiqueta "-10 %" cuando el café tiene descuento | Etiopía | `getByText('13.41 €')` y `getByText('-10 %')` | `toBeInTheDocument()` (×2) |
| no debería mostrar ninguna etiqueta de descuento cuando el café no tiene descuento | Colombia | `queryByText(/%/)` | `not.toBeInTheDocument()` |
| debería llamar a onAdd una vez y con ese café cuando se pulsa el botón de añadir | Colombia | `getByRole('button', { name: 'Añadir Colombia Huila al carrito' })` + `await user.click` | `toHaveBeenCalledTimes(1)` y `toHaveBeenCalledWith(colombia)` |

Por qué cada consulta:

- **El nombre, por rol `heading` + `level: 3` + `name`.** Así se comprueban
  tres cosas a la vez: que es un encabezado, que es de nivel 3 y que su
  nombre accesible es el del café. Con `getByText('Etiopía Yirgacheffe')`
  el test seguiría en verde si el `<h3>` pasara a ser un `<p>`, y además
  esa búsqueda no es única: el botón también contiene el nombre.
- **El precio y el descuento, con `getByText` y el texto exacto.** Un `<p>`
  no tiene ningún rol que lo distinga, así que se busca como lo lee una
  persona, por su texto. Se busca el precio final (`13.41 €`), no el
  original (`14.90 €`): si la tarjeta se saltara `finalPrice`, fallaría.
  `0.1 * 100` da `10` exacto en JavaScript (comprobado con `node -e`), así
  que React pinta `10` y no `10.000000000000002`. El `<p>` de la etiqueta
  tiene **tres nodos de texto** (`"-"`, `"10"` y `" %"`), porque
  `-{coffee.discount * 100} %` tiene una expresión entre dos textos. Aun así
  `getByText('-10 %')` lo encuentra. El comparador por defecto junta los
  nodos de texto que son hijos directos de cada elemento, y aquí los tres
  cuelgan del mismo `<p>`. Sólo fallaría si el número fuera dentro de otra
  etiqueta (`<span>10</span>`).
- **Sin descuento, `queryByText(/%/)` + `not.toBeInTheDocument()`.**
  `getBy…` lanza si no encuentra nada, así que no sirve para comprobar que
  algo no está; `queryBy…` devuelve `null`. Se busca con la expresión
  regular `/%/`, que casa con cualquier texto que contenga `%`. Así el test
  vale para cualquier porcentaje (`-15 %`, `-0 %`…), no sólo para el `-10 %`
  de Etiopía.
- **El botón, por rol `button` + `name`.** Es como lo encuentran un usuario
  y un lector de pantalla, y fija que el botón dice de qué café es (ver la
  respuesta 📝 de O4). `userEvent.setup()` va en el Arrange y el `await
  user.click(...)` es el Act: `user.click` devuelve una promesa porque
  simula toda la secuencia de eventos del puntero (`pointerdown`,
  `mousedown`, `pointerup`, `mouseup`, `click`) de forma asíncrona. Sin el
  `await`, los `expect` se ejecutarían antes de que llegue el `click` y
  `onAdd` todavía tendría 0 llamadas.
- **`toHaveBeenCalledWith(colombia)` con el café entero**, no
  `expect.objectContaining({ id: 2 })`. `toHaveBeenCalledWith` compara el
  argumento por igualdad profunda (como `toEqual`), así que un `price`
  cambiado se nota. Con `objectContaining({ id: 2 })` sólo se comprobaría el
  `id`, y el 💥 del enunciado no se pondría rojo (comprobado: ver abajo).

Decisiones:

- **`import React from 'react'` en el spec.** El `tsconfig.json` del
  `.start-code` tiene `"jsx": "react"` (el runtime clásico, que traduce
  `<CoffeeCard />` a `React.createElement(...)`), y la config de Vitest no
  carga `@vitejs/plugin-react`. Sin el import, los 4 tests fallan con
  `ReferenceError: React is not defined`. Es lo mismo que hacen todos los
  ficheros de `src/` (`coffee-card.tsx` incluido). No se ha tocado la
  configuración.
- **Sin `<ul>` alrededor.** `CoffeeCard` pinta un `<li>`, y `render` lo mete
  en un `<div>` dentro de `document.body`. Lo comprobé: con React 19.2.7 la
  ejecución no da ningún aviso de `validateDOMNesting`
  ([docs/o4-consola.txt](docs/o4-consola.txt), con `--silent=false`;
  [docs/o4-verde.txt](docs/o4-verde.txt) no sirve para esto, porque salió
  con el reporter `minimal` del modo agente, que esconde la consola de los
  tests que pasan; ver O1). El único
  bloque `stderr` es el aviso `Your app (or one of its dependencies) is using
  an outdated JSX transform`, que React da en el primer render del fichero
  por el `"jsx": "react"` del `tsconfig.json` y no tiene que ver con el
  `<li>`. React sólo avisa de los
  anidamientos que el parser de HTML corregiría (un `<div>` dentro de un
  `<p>`, un `<tr>` fuera de `<tbody>`…), y un `<li>` dentro de un `<div>` no
  es uno de ellos. Como no hay aviso, no hace falta la opción `container`
  de `render` ni un `<ul>`, y ninguna consulta depende de que exista la lista.
- **Cada test hace su propio `render`, sin `beforeEach`.** Con `globals:
  true`, `@testing-library/react` encuentra un `afterEach` global al
  importarse y registra él solo `afterEach(cleanup)`, que desmonta lo
  renderizado y vacía el `document.body` después de cada test. Lo comprobé
  desactivándolo con la variable de entorno que trae para eso
  (`RTL_SKIP_AUTO_CLEANUP=true`,
  [docs/o4-sin-cleanup.txt](docs/o4-sin-cleanup.txt)): fallan 3 de 4 con
  `Found multiple elements with the text: 13.41 €`, `… with the text: /%/`
  y `… with the role "button" and name "Añadir Colombia Huila al carrito"`,
  porque las tarjetas de los tests anteriores siguen en el DOM. Sin la
  limpieza, el test "sin descuento" encontraría el `-10 %` de Etiopía, y
  dependería del orden de los tests.

### Comprobado

- [docs/o4-verde.txt](docs/o4-verde.txt): `Test Files  3 passed (3)`,
  `Tests  22 passed (22)` (12 de O2 + 6 de O3 + 4 de O4). `npm run
  type-check` limpio. Esta salida salió con el reporter `minimal` (modo
  agente), que esconde la consola de los tests que pasan, así que no prueba
  que no haya avisos.
- [docs/o4-consola.txt](docs/o4-consola.txt): sólo el spec de O4, con
  `--silent=false`. `Tests  4 passed (4)` y un único bloque `stderr`, en el
  primer test: `… is using an outdated JSX transform` (por el `"jsx":
  "react"` del `tsconfig.json`). Ningún `validateDOMNesting`.
- [docs/o4-sin-cleanup.txt](docs/o4-sin-cleanup.txt): sólo el spec de O4 con
  `RTL_SKIP_AUTO_CLEANUP=true`. `Tests  3 failed | 1 passed (4)`, el primero
  pasa porque el DOM todavía está vacío.
- [docs/o4-romper-objectcontaining.txt](docs/o4-romper-objectcontaining.txt):
  con el 💥 aplicado, un spec temporal (`tmp-object-containing.spec.tsx`, ya
  borrado) con `toHaveBeenCalledWith(expect.objectContaining({ id: 2 }))`
  **pasa** (`Test Files  1 failed | 1 passed (2)`: el que falla es el spec
  bueno). Por eso el spec bueno compara el café entero.
- El 💥 del enunciado, en la tabla de abajo. Sólo pone en rojo el test de
  `onAdd`. En la revisión de O7 vi que los otros tres no se habían visto
  fallar con un cambio en el código (en `o4-sin-cleanup.txt` fallan dos,
  pero por la limpieza, no por el código). Al del encabezado y al de "sin
  descuento" les hice un 💥 a cada uno:
  [docs/o4-romper-otros.txt](docs/o4-romper-otros.txt) (`<h3>` → `<h2>`, y
  la etiqueta de descuento siempre visible). El del precio se pone en rojo
  con R1 y R6 de la revisión y con el 💥 2 de O2 repetido con la suite final
  ([docs/repaso-romper.txt](docs/repaso-romper.txt)). Ver la entrada 16 de
  la bitácora.

## O5 · El catálogo

Fichero `lab-testing/src/catalog/coffee-catalog.spec.tsx`: 9 tests en cuatro
`describe` (carga, error, buscador y carrito). Cada test crea su propio spy de
`getCoffees`, hace su propio `render(<CoffeeCatalog />)` y, si interactúa,
crea su propio `userEvent.setup()`. Ningún test depende de otro.

### Qué se mockea y qué no

- **Sólo `getCoffees`**, con `vi.spyOn(api, 'getCoffees')` sobre
  `import * as api from './coffee.api'`, como en la demo 08. Es lo único que
  sale del proceso: llama a `fetch`, y en jsdom no hay ninguna API en
  `/api/coffees`. `mockResolvedValue(coffees)` devuelve los tres cafés de
  `test-data.ts`, y `mockRejectedValue(new Error('Servicio no disponible'))`
  da el caso de error. `restoreMocks: true` deshace el spy después de cada
  test.
- **El spy funciona con esta versión** (Vitest 5.1.0, ESM): no da `Cannot
  redefine property`, y el componente recibe la función espiada. Se nota en
  que los tests de carga ven los 3 cafés: con el `getCoffees` real, `fetch`
  fallaría, se vería la alerta y no habría ningún `listitem`. No ha hecho
  falta `vi.mock`.
- **No se mockea nada más.** `useCart`, las funciones de `cart.ts`
  (`addToCart`, `cartTotal`, `finalPrice`, `formatPrice`) y `CoffeeCard` son
  los reales. Por eso los tests del carrito son de integración: el clic llega
  al botón de la tarjeta real, que llama al `add` del hook real, que usa
  `addToCart`, y el texto final sale de `cartTotal` y `formatPrice`.

### Por qué `findBy`

El efecto llama a `getCoffees()` al montarse, pero la promesa se resuelve
**después** del primer render. Ese primer render sólo pinta `<p>Cargando…</p>`.
Los cafés, el campo Buscar, los botones y el resumen aparecen en un segundo
render, cuando se ejecutan `setCoffees` y `setLoading(false)`. `findBy…`
devuelve una promesa que reintenta la consulta (hasta 1000 ms) y se resuelve
cuando aparece el elemento. Además envuelve la espera en `act`, así que las
actualizaciones de estado de la promesa no dan el aviso `not wrapped in
act(...)`. Una vez hay un `findBy` resuelto, lo demás ya está en el DOM y
basta con `getBy`. `user.type` y `user.click` llevan `await` y actualizan el
estado de forma síncrona (no hay más promesas), así que después tampoco hace
falta `findBy` ni `waitFor`.

### Los tests

| Test | Mock | Act | Consulta y matcher |
| --- | --- | --- | --- |
| debería mostrar "Cargando…" cuando getCoffees todavía no ha respondido | resuelve con 3 cafés | `render` | `getByText('Cargando…')` justo después del render → `toBeInTheDocument()`; al final, `await findAllByRole('listitem')` para que la carga termine dentro de `act` |
| debería mostrar los 3 cafés y quitar "Cargando…" cuando getCoffees resuelve | resuelve con 3 cafés | `render` + `await findAllByRole('listitem')` | `toHaveLength(3)`; `queryByText('Cargando…')` → `not.toBeInTheDocument()`; spy → `toHaveBeenCalledTimes(1)` |
| debería mostrar una alerta con el mensaje del error cuando getCoffees rechaza | rechaza con `Error('Servicio no disponible')` | `render` + `await findByRole('alert')` | `toHaveTextContent('Servicio no disponible')` |
| debería mostrar sólo Brasil Cerrado cuando se escribe "bra" en Buscar | resuelve | `await findByLabelText('Buscar')`, `user.type(…, 'bra')` | `getAllByRole('listitem')` → `toHaveLength(1)`; `within(item).getByRole('heading', { name: 'Brasil Cerrado' })` |
| debería mostrar "Sin resultados" y ningún café cuando el texto no coincide con ninguno | resuelve | "bra", `user.clear`, "zzz" | `getByText('Sin resultados')`; `queryAllByRole('listitem')` → `toHaveLength(0)` |
| debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas | resuelve | `user.type(…, 'BRA')` | igual que el de "bra" |
| debería tener "Vaciar carrito" desactivado cuando el carrito está vacío | resuelve | `await findByRole('button', { name: 'Vaciar carrito' })` | `toBeDisabled()` |
| debería mostrar "2 bolsas · 23.91 €" y activar "Vaciar carrito" cuando se añaden Etiopía y Brasil | resuelve | `await findByRole` del botón de Etiopía, clic en Etiopía y en Brasil | `getByText('2 bolsas · 23.91 €')`; botón → `toBeEnabled()` |
| debería volver a "0 bolsas · 0.00 €" cuando se pulsa "Vaciar carrito" | resuelve | añade los dos cafés y pulsa "Vaciar carrito" | `getByText('0 bolsas · 0.00 €')` |

Decisiones:

- **El test de "Cargando…" acaba con un `await findAllByRole('listitem')`.**
  El `render` lanza el efecto, pero la promesa del mock se resuelve en una
  microtarea posterior, así que justo después del `render` todavía se ve
  "Cargando…" y basta con `getByText`. Pero la promesa se resuelve **antes**
  del `cleanup` automático, con el componente todavía montado: comprobado
  con un spec temporal que apuntaba el orden en un fichero ("fin del test" →
  "promesa resuelta" con `<p>Cargando…</p>` en el `body` → `afterEach`).
  Sin la espera, `setCoffees` y `setLoading(false)` ocurren fuera de `act`,
  y React avisa dos veces: `An update to CoffeeCatalog inside a test was not
  wrapped in act(...)`
  ([docs/o5-sin-esperar-carga.txt](docs/o5-sin-esperar-carga.txt)). Con la
  espera, esas dos actualizaciones ocurren dentro del `act` de `findBy` y el
  aviso desaparece. No es una aserción, sino la forma de que el test no
  termine con trabajo pendiente; por eso lleva un comentario.
- **Lanzado por un agente, Vitest 5 esconde la consola de los tests que
  pasan.** Con el reporter `minimal`, el que elige cuando detecta
  `CLAUDECODE` o `AI_AGENT` (ver O1), la salida de `npx vitest run` no
  enseña ningún `stderr` si el test pasa, así que buscar "not wrapped in
  act" en esa salida no demuestra nada (así me equivoqué la primera vez:
  bitácora, entrada 8). En tu terminal (reporter `default`) los avisos sí
  salen, como en [docs/vitest-final.txt](docs/vitest-final.txt); al
  principio lo atribuí a Vitest 5 en general, y no es así (entrada 13).
  `--silent=false` los enseña en los dos casos. Así están hechos
  [docs/o5-verde.txt](docs/o5-verde.txt) y
  [docs/o5-sin-esperar-carga.txt](docs/o5-sin-esperar-carga.txt). Los
  `o5-romper-*.txt` usan el comando de siempre: allí sólo interesa qué test
  falla.
- **`within(items[0])` + encabezado** en vez de `getByText('Brasil Cerrado')`.
  El nombre sale dos veces en la tarjeta (`<h3>` y botón «Añadir Brasil
  Cerrado al carrito»), pero `getByText` busca el texto exacto, así que no
  habría ambigüedad. Aun así, con `within` se comprueba que el único
  `listitem` que queda es el de Brasil, no sólo que "Brasil Cerrado" está en
  algún sitio de la página.
- **`"2 bolsas · 23.91 €"` con `getByText` y el texto tal cual, sin función
  como matcher.** `{units} bolsas · {formatPrice(total)}` genera tres nodos
  de texto (`"2"`, `" bolsas · "` y `"23.91 €"`) dentro del mismo `<p>`, y el
  comparador por defecto junta los nodos de texto que son hijos directos de
  cada elemento, como con el `-10 %` de O4. Comprobado: el test pasa. Las
  cuentas: Etiopía 14.90 × 0.9 = 13.41, más Brasil 10.50, da 23.91.
- **Separados en tres tests los casos del buscador y del carrito**: cada
  test comprueba una cosa. El de vaciar repite los dos clics en su Arrange
  en vez de depender del test anterior.
- **El test de "BRA"** no está en el enunciado: es la respuesta al 🤔 (ver
  la tabla de 💥).

### Comprobado

- [docs/o5-verde.txt](docs/o5-verde.txt) (con `--silent=false`): `Test
  Files  4 passed (4)`, `Tests  31 passed (31)` (12 de O2 + 6 de O3 + 4 de
  O4 + 9 de O5), sin ningún aviso `not wrapped in act(...)`. Sólo quedan dos
  bloques `stderr`, uno en el primer test de O4 y otro en el primero de O5,
  con el mismo aviso: `Your app (or one of its dependencies) is using an
  outdated JSX transform`. React lo da en el primer render de cada fichero
  porque el `tsconfig.json` del `.start-code` usa `"jsx": "react"` (el
  runtime clásico); no tiene que ver con los tests. `npm run type-check`
  limpio.
- [docs/o5-sin-esperar-carga.txt](docs/o5-sin-esperar-carga.txt) (con
  `--silent=false`): sólo el spec de O5, con el test de "Cargando…" sin la
  espera final. Los 9 pasan, pero ese test imprime dos veces `An update to
  CoffeeCatalog inside a test was not wrapped in act(...)`.
- Los 💥 del enunciado, en la tabla de abajo. Entre los tres sólo ponen en
  rojo 4 de los 9 tests. Para ver fallar los otros cinco se hicieron 6 💥
  más, uno cada vez y deshecho después:
  [docs/o5-romper-otros.txt](docs/o5-romper-otros.txt). Fueron estos:
  "Cargando…" con tres puntos (falla el de "Cargando…"); sin `.finally(() =>
  setLoading(false))` (fallan los 9: la carga no termina nunca);
  `setError('Error')` (el de la alerta); `visible.length < 0` (el de "zzz");
  sin `onClick={clear}` (el de vaciar); y `disabled` siempre (el de activar y
  el de vaciar).

## O6 · useCart

`src/catalog/use-cart.spec.ts`: 4 tests de `useCart` sin ningún componente,
con `renderHook` y `act` de `@testing-library/react`. Los datos son los tres
cafés de `test-data.ts`. Se usa Brasil Cerrado (10.5 €, sin `discount`) para
que el total salga redondo: 2 × 10.5 = 21. Ningún test depende de otro: cada
uno hace su propio `renderHook`, y Testing Library desmonta el hook después
de cada test.

### Por qué `renderHook`

Un hook sólo se puede llamar dentro de un componente que React esté
renderizando. Comprobado con un spec temporal (ya borrado): si se llama
`useCart(coffees)` a pelo desde el test, React escribe en consola `Invalid
hook call. Hooks can only be called inside of the body of a function
component…` y el test falla con `TypeError: Cannot read properties of null
(reading 'useState')`. `renderHook(() => useCart(coffees))` monta un
componente de prueba (`TestComponent`, el nombre que sale en el aviso de
[docs/o6-sin-act.txt](docs/o6-sin-act.txt)) que llama al hook en cada render
y guarda lo que devuelve en `result.current`. Así se prueba el hook directamente:
no hace falta inventar un componente con botones para pulsarlos ni leer
textos del DOM. Lo que se comprueba son los valores que devuelve (`cart`,
`units`, `total`).

**`result.current` se lee después de cada `act`.** Cada render deja en
`result.current` un objeto nuevo. Si se guardara en una constante antes
(`const { add, units } = result.current`), esa constante se quedaría con el
objeto del primer render: `units` valdría 0 para siempre. El comentario está
en el caso 2 del spec.

### Los tests

| Test | Act | Assert |
| --- | --- | --- |
| debería empezar con el carrito vacío, 0 unidades y total 0 cuando se monta el hook | sólo `renderHook` | `cart` → `toEqual([])` (es un array: `toBe` compararía referencias); `units` → `toBe(0)`; `total` → `toBe(0)` (`cartTotal` de un carrito vacío es 0 exacto, no hay decimales que redondear) |
| debería tener 2 unidades y un total de 21 cuando se añade Brasil dos veces en dos act seguidos | `act(() => add(brazil))` dos veces, por separado | `units` → `toBe(2)`; `total` → `toBeCloseTo(21)` (sale de multiplicar decimales) |
| debería quedarse con 0 unidades cuando se añade un café y después se vacía el carrito | Arrange: `act(() => add(brazil))`; Act: `act(() => clear())` | `units` → `toBe(0)` |
| debería tener 2 unidades cuando se añade Brasil dos veces dentro del mismo act | `act(() => { add(brazil); add(brazil); })` | `units` → `toBe(2)` |

No se mockea nada: el hook no sale del proceso (ni `fetch` ni tiempo).

### Comprobado

- [docs/o6-verde.txt](docs/o6-verde.txt) (con `--silent=false`): `Test
  Files  5 passed (5)`, `Tests  35 passed (35)` (12 de O2 + 6 de O3 + 4 de
  O4 + 9 de O5 + 4 de O6). El spec de O6 no imprime nada: ni avisos de
  `act` ni el del JSX transform, porque no renderiza JSX. Los dos únicos
  bloques `stderr` son los de O4 y O5 que ya se explicaron arriba. `npm run
  type-check` limpio.
- [docs/o6-sin-act.txt](docs/o6-sin-act.txt): un spec temporal
  (`use-cart-sin-act.spec.ts`, ya borrado) con el caso 2 y con un solo
  `add`, los dos sin `act`. Los dos se ponen en rojo con el valor viejo
  (`expected +0 to be 2` y `expected +0 to be 1`), y cada `add` imprime
  `An update to TestComponent inside a test was not wrapped in act(...)`.
  En esta versión (React 19.2, Testing Library 16.3, Vitest 5.1) no pasa
  igual: sale el aviso **y** el test lee el valor viejo.
- [docs/o6-romper-1.txt](docs/o6-romper-1.txt): el 💥 del enunciado sólo
  pone en rojo el caso 4. Para ver fallar los otros tres se hicieron 4 💥
  más, uno cada vez y deshecho después:
  [docs/o6-romper-otros.txt](docs/o6-romper-otros.txt). Fueron estos: el
  estado inicial `[{ coffeeId: 3, quantity: 0 }]` (falla el caso 1 sólo por
  el `toEqual([])`, porque `units` y `total` siguen a 0); `units =
  cart.length` (los casos 2 y 4: `expected 1 to be 2`); `cartTotal(cart,
  [])` (el caso 2 por el total: `expected +0 to be close to 21`); y `clear`
  que no vacía (el caso 3: `expected 1 to be +0`).

## P1 · Cobertura

```bash
cd 06-Testing/lab-testing
npm run test:coverage
```

Es `vitest run -c ./config/test/config.ts --coverage`. Pasa todos los tests
una vez y, al acabar, imprime la tabla de cobertura y escribe el informe HTML
en `lab-testing/coverage/`. Esa carpeta está en el `.gitignore` y no aparece
en `git status`. `npm test` y `npm run test:run` no miden nada, porque la
cobertura sólo se activa con `--coverage`.

### Instalación y configuración

```bash
npm install -D @vitest/coverage-v8@5.1.0
```

Va con la misma versión que `vitest` (5.1.0, `node -p
"require('vitest/package.json').version"`), porque su `peerDependencies`
pide `vitest: '5.1.0'` exacta (`npm view @vitest/coverage-v8@5.1.0
peerDependencies`). En `config/test/config.ts`:

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  include: ['src/catalog/**/*.{ts,tsx}'],
  exclude: ['src/catalog/**/*.spec.{ts,tsx}', 'src/catalog/test-data.ts'],
},
```

Los nombres están comprobados en los tipos de la versión instalada
(`interface CoverageOptions` en `node_modules/vitest/dist/`):

- `provider: 'v8'`: usa los contadores que ya trae el motor V8 de Node, sin
  reescribir el código (`'istanbul'` sí lo instrumenta). Es el valor por
  defecto, pero queda escrito para que se vea qué paquete hace falta.
- `reporter`, en singular. `test.reporters`, en plural, es otra opción: la
  de los resultados de los tests. Por defecto serían `['text', 'html',
  'clover', 'json']`. Los dos últimos son para herramientas de CI y aquí no
  se usan.
- `include`: los ficheros que salen en el informe, aunque ningún test los
  importe. Sin `include` sólo aparecen los que algún test carga.
- `exclude`: se aplica después de `include` y quita los propios tests y los
  datos de prueba, que si no inflarían el porcentaje.

⚠️ **Vitest 5 cambia la tabla cuando lo lanza un agente de IA.** Mira
variables como `CLAUDECODE` o `AI_AGENT` (con `std-env`). Si las encuentra,
pone `skipFull: true` en el reporter `text`, que oculta las filas al 100 %, y
añade un `text-summary`. En una terminal normal sale la tabla entera. Las
salidas de `docs/` se generaron sin esas variables (`env -u AI_AGENT -u
CLAUDECODE -u CLAUDE_CODE NO_COLOR=1 npm run test:coverage`), para que sean
lo que ve una persona.

### Abrir el informe HTML

`coverage/index.html` se sirve en el puerto 4173, que ya está en
`forwardPorts` del DevContainer. No hay que instalar nada:

```bash
cd 06-Testing/lab-testing
npx vite preview --outDir coverage --port 4173 --strictPort
```

Después se abre `http://localhost:4173/` en el navegador de Windows y se
sale con `Ctrl+C`. `vite preview` sirve una carpeta ya generada (por
defecto `dist`, aquí `coverage`). Con `--strictPort` falla si el 4173 está
ocupado, en vez de cambiar de puerto sin avisar. Alternativa con el python3
del contenedor: `python3 -m http.server 4173 -d coverage`. Las dos
comprobadas con `curl`: `/` devuelve `200` con `<title>Code coverage report
for All files</title>`, y `/use-cart.ts.html` también devuelve `200`.

### Líneas, ramas y funciones

- **Sentencias y líneas** (`% Stmts`, `% Lines`): si cada sentencia (o
  línea) se ha ejecutado al menos una vez.
- **Funciones** (`% Funcs`): si cada función se ha llamado al menos una vez,
  contando también las flechas que van dentro de otras.
- **Ramas** (`% Branch`): si se ha recorrido cada camino de cada decisión
  (`if`, `? :`, `??`, `&&`, cada `case`).
  - En `coffee-card.tsx`, `{coffee.discount ? <p>…</p> : null}` son dos
    ramas. Las dos se recorren porque los tests de O4 pintan Etiopía (con
    `discount`) y Colombia (sin él). Con un solo café, la línea saldría al
    100 % y las ramas no.
  - En `coffee.api.ts`, el `if (!response.ok)` tiene dos ramas y el `switch`
    tres más (`404`, `503`, `default`). O3 prueba la respuesta buena, el 404,
    el 503 y el 500. Sin el test del 503, la línea `throw new Error('Servicio
    no disponible')` saldría sin cubrir.

### Antes ([docs/p1-cobertura-antes.txt](docs/p1-cobertura-antes.txt))

```
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
All files          |   96.77 |      100 |   92.59 |     100 |
 cart.ts           |     100 |      100 |     100 |     100 |
 coffee-card.tsx   |     100 |      100 |     100 |     100 |
 ...ee-catalog.tsx |     100 |      100 |     100 |     100 |
 coffee.api.ts     |     100 |      100 |     100 |     100 |
 model.ts          |       0 |        0 |       0 |       0 |
 use-cart.ts       |   85.71 |      100 |   71.42 |     100 |
```

- **`use-cart.ts`**: lo único sin cubrir es `remove` (línea 9). Ningún test
  de O6 la llama. Faltan 2 de 7 funciones (la flecha `remove` y la
  `(previous) => removeFromCart(…)` de dentro) y 2 de 14 sentencias (sus
  cuerpos). Aun así **las líneas salen al 100 %**: `const remove = …` se
  ejecuta en cada render, porque crear la función ya cuenta como ejecutar la
  línea, aunque nunca se llame. Por eso `Uncovered Line #s` sale vacío. En el HTML,
  `coverage/use-cart.ts.html` marca `remove = (c…` y `setCart((…` con
  `title="function not covered"`.
- **`model.ts`**: sólo tiene `interface`. TypeScript las borra al compilar,
  así que no hay nada que ejecutar (0 de 0) y no baja el total.
- **El resto**, al 100 %: los tests de O2 a O5 recorren todas sus ramas.

### Tests añadidos

En `src/catalog/use-cart.spec.ts`, después de los cuatro de O6:

| Test | Arrange | Act | Assert |
| --- | --- | --- | --- |
| debería quedarse con 0 unidades, carrito vacío y total 0 cuando se añade Brasil y después se quita | `act(() => add(brazil))` | `act(() => remove(brazil.id))` | `cart` → `toEqual([])`; `units` → `toBe(0)`; `total` → `toBe(0)` |
| debería dejar sólo Colombia (1 unidad, total 12,90) cuando hay Colombia y Brasil y se quita Brasil | `add(colombia)` y `add(brazil)`, cada uno en su `act` | `act(() => remove(brazil.id))` | `cart` → `toEqual([{ coffeeId: colombia.id, quantity: 1 }])`; `units` → `toBe(1)`; `total` → `toBeCloseTo(12.9)` |

Para cubrir la línea bastaba con el primero. El segundo está porque un
`remove` que vacía todo el carrito (el 💥 2 de P1) deja el primero en verde:
sólo se nota si queda otro café que no se tenía que ir. Que `removeFromCart`
quite todas las unidades a la vez y no mute el carrito ya lo prueba
`cart.spec.ts`, así que no se repite aquí. No se mockea nada.

### Después ([docs/p1-cobertura-despues.txt](docs/p1-cobertura-despues.txt))

```
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
All files          |     100 |      100 |     100 |     100 |
 cart.ts           |     100 |      100 |     100 |     100 |
 coffee-card.tsx   |     100 |      100 |     100 |     100 |
 ...ee-catalog.tsx |     100 |      100 |     100 |     100 |
 coffee.api.ts     |     100 |      100 |     100 |     100 |
 model.ts          |       0 |        0 |       0 |       0 |
 use-cart.ts       |     100 |      100 |     100 |     100 |
```

`Tests  37 passed (37)` (35 de O1-O6 + 2 de P1). `npm run type-check`
limpio.

### Por qué un 100 % no quiere decir "bien probado"

La cobertura mide **qué se ejecuta**, no **qué se comprueba**. Un test sin
ningún `expect` ejecuta el código igual que uno bueno, así que "cubre" lo
mismo. Para demostrarlo
([docs/p1-sin-asserts.txt](docs/p1-sin-asserts.txt)) se usó un spec temporal,
`src/catalog/tmp-sin-asserts.spec.ts`, ya borrado. Llama a todas las
funciones de `cart.ts` (`formatPrice`, `finalPrice` con y sin descuento,
`addToCart` con un café que está y con otro que no, `removeFromCart` y
`cartTotal` con un id que no existe) **sin ningún `expect`**. Se midió sólo
`cart.ts` con:

```bash
npx vitest run -c ./config/test/config.ts src/catalog/tmp-sin-asserts.spec.ts --coverage --coverage.include=src/catalog/cart.ts
```

| | `cart.ts` | Tests |
| --- | --- | --- |
| Código sin tocar | 100 / 100 / 100 / 100 | `1 passed (1)` |
| Con el 💥 de `finalPrice` de O2 (`coffee.price * (1 - (coffee.discount ?? 0))` → `coffee.price`) | 100 / 100 / 100 / 100 | `1 passed (1)` |
| El mismo 💥 con `cart.spec.ts` | — | `2 failed \| 10 passed (12)` (`expected 14.9 to be close to 13.41`, `expected 40.3 to be close to 37.32`) |

Con el precio mal calculado, la cobertura sigue al 100 % y todo en verde.
Los 💥 son lo que dice si un test sirve: si se rompe el código y ningún test
se pone en rojo, ese código no está probado, salga el porcentaje que salga.
Es lo mismo que el 🪤 de O3: el try/catch sin `expect.assertions` pasaba con
un 200 sin llegar a ejecutar el `expect`, y ese test también "cubría" el
`getCoffees`. La cobertura sirve para lo contrario: una línea **sin**
cubrir seguro que no está probada (como `remove`). Una línea cubierta sólo
dice que se ha ejecutado.

Un detalle de la primera versión del spec temporal: sólo usaba Etiopía y un
carrito con un único café, y se quedaba en `% Branch 75` (líneas 6 y 11: el
`?? 0` y el `: item` del `map`). Con el 💥 **subía** a 83,33 %, porque el
💥 borra la rama del `??`. Romper el código puede hacer que suba la
cobertura (ver la bitácora).

## D2 · MSW

En O3 y O5 se espía la red (`vi.spyOn(globalThis, 'fetch')` y
`vi.spyOn(api, 'getCoffees')`). En D2 se simula **el servidor** con Mock
Service Worker: `getCoffees`, `fetch` y `Response` se ejecutan de verdad, y
MSW intercepta la petición antes de que salga del proceso y la contesta. Los
specs de O3 y O5 se quedan como estaban; los de MSW van en ficheros nuevos
para poder comparar.

### Instalación

```bash
npm install -D msw@3.0.3
```

`msw@3.0.3` era la `latest` de npm. Pide Node `>=22.12.0` (el DevContainer
tiene `v22.23.4`); sus peers (`vite`, `typescript`, `graphql`) son opcionales
y los que usamos se cumplen. `npm audit` sigue con las mismas 8
vulnerabilidades de antes: `msw` no añade ninguna.

Dos cosas de la versión 3 comprobadas en `node_modules/msw` (tipos y
runtime), distintas de lo que suele aparecer en ejemplos de la 2.x:

- La opción para las peticiones sin handler se llama **`onUnhandledFrame`**,
  no `onUnhandledRequest`: el nombre antiguo no aparece ni en los tipos ni en
  el código. Se usa `server.listen({ onUnhandledFrame: 'error' })`.
- `http` y `HttpResponse` se pueden importar de `msw` (o de `msw/http`);
  `setupServer`, de `msw/node`.

### Ficheros

| Fichero | Qué hace |
| --- | --- |
| `src/catalog/mocks/handlers.ts` | `http.get(url, () => HttpResponse.json({ data: coffees }))`: el "servidor feliz" por defecto, con la `url` de `coffee.api.ts` |
| `src/catalog/mocks/server.ts` | `setupServer(...handlers)` |
| `src/catalog/coffee.api.msw.spec.ts` | 6 tests de `getCoffees`: los mismos casos que O3 |
| `src/catalog/coffee-catalog.msw.spec.tsx` | 4 tests de carga y error del catálogo, sin ningún `vi.spyOn` (`.tsx` porque lleva JSX) |

Cada spec arranca y para el servidor él mismo:

```ts
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Por fichero y no en `setup.ts`.** Con el servidor en `setup.ts`, MSW
escucharía en todos los ficheros de test (`cart.spec`, `coffee-card.spec`,
los de O3 y O5 con spies…): no se podría olvidar y cualquier petición sin
handler en cualquier test daría error, pero los specs con spy correrían con
MSW debajo (el spy tapa el `fetch` parcheado por MSW) y la comparación dejaría
de ser limpia, y todos los ficheros pagarían la interceptación. Por fichero,
sólo los dos `.msw` interceptan; el coste son tres líneas repetidas y el
riesgo de olvidarlas en un spec nuevo.

### La URL relativa

`getCoffees` llama a `fetch('/api/coffees')`. En jsdom, `fetch` la resuelve
contra `location`, y en esta configuración (Vitest + jsdom sin `url`)
`location.origin` es `http://localhost:3000`. MSW ve la petición como
`GET http://localhost:3000/api/coffees` y el handler con ruta relativa
`'/api/coffees'` la casa porque MSW también la resuelve contra
`location.origin`. Comprobado con un spec de sonda (borrado) que imprimía
`location.origin` y el `request.url` de `server.events.on('request:start')`:

```
location.origin = http://localhost:3000 | document.baseURI = http://localhost:3000/
MSW ve: GET http://localhost:3000/api/coffees
status 200 body {"data":[{"id":1,"name":"Etiopía Yirgacheffe",...
```

La misma sonda pidió `/api/otra` (sin handler): con `'error'`, MSW imprime
`[MSW] Error: intercepted a request without a matching request handler` y el
`fetch` rechaza con `TypeError: fetch failed`. El test falla porque la promesa
rechaza, no por arte de magia: por eso en el verde se busca `[MSW]` en la
salida (0 apariciones).

### Los tests

`coffee.api.msw.spec.ts`:

| Test | Arrange | Assert |
| --- | --- | --- |
| debería devolver los cafés del campo data cuando la API responde 200 | handler por defecto | `toEqual(coffees)` |
| debería mandar la cabecera Accept: application/json cuando pide GET /api/coffees | `server.use` con un handler que guarda `request.headers.get('accept')` | `toBe('application/json')` |
| debería rechazar con "$message" cuando la API responde $status (`it.each` 404/503/500) | `server.use(http.get(url, () => HttpResponse.json({ data: coffees }, { status })))` | `await expect(…).rejects.toThrow(message)` |
| debería propagar el TypeError "fetch failed" de Node cuando la red falla | `server.use(http.get(url, () => HttpResponse.error()))` | `rejects.toThrow(TypeError)` y `rejects.toThrow('fetch failed')` |

`coffee-catalog.msw.spec.tsx`:

| Test | Arrange | Assert |
| --- | --- | --- |
| debería mostrar "Cargando…" cuando la API todavía no ha respondido | handler por defecto | `getByText('Cargando…')`, y después `await findAllByRole('listitem')` para que el `setState` no quede fuera de `act` |
| debería mostrar los 3 cafés y quitar "Cargando…" cuando la API responde 200 | handler por defecto | `findAllByRole('listitem')` de longitud 3; `queryByText('Cargando…')` no está |
| debería mostrar la alerta "Servicio no disponible" cuando la API responde 503 | `server.use` con un 503 | `findByRole('alert')` con `toHaveTextContent` |
| debería mostrar una alerta con "fetch failed" cuando la red falla | `HttpResponse.error()` | `findByRole('alert')` con `toHaveTextContent('fetch failed')` |

`server.use` añade el handler **delante** de los de `setupServer` sólo hasta
el `afterEach(resetHandlers)`, que vuelve a dejar el de `handlers.ts`: así
ningún test depende de otro.

Dos diferencias con los tests de O3 que sólo salen con MSW:

- **El mensaje de red es el de verdad.** Con el spy, `'Failed to fetch'` lo
  escribíamos nosotros en `mockRejectedValue` (es el mensaje de Chrome). Con
  `HttpResponse.error()` el `fetch` real de Node rechaza con
  `TypeError: fetch failed`.
- **La cabecera es la que se manda, no el argumento.** En O3,
  `toHaveBeenCalledWith` comprueba con qué objeto se llamó a `fetch`. Aquí el
  handler lee la petición que construyó `fetch`. Con el 💥 D2-2 (sin
  `headers`) el handler ve `Accept: */*`, el valor que pone `fetch` por
  defecto (`expected '*/*' to be 'application/json'`).

### Comprobado

- [docs/d2-verde.txt](docs/d2-verde.txt): `Test Files  7 passed (7)`,
  `Tests  47 passed (47)` (los 37 de antes + 10 de MSW), 0 líneas con `[MSW]`
  y `npm run type-check` con salida 0.
- [docs/d2-romper.txt](docs/d2-romper.txt): 7 💥 (tabla de "Romper el
  código"); los 10 tests de MSW se ven en rojo al menos una vez.
- [docs/d2-axios.txt](docs/d2-axios.txt): el experimento de axios, abajo.

### ¿Y si mañana `getCoffees` usa axios?

`axios@1.18.1` ya venía en el `package.json` del `.start-code` (commit
`c2fc696 L6 - Setup`), así que se probó con axios de verdad **sin instalar
nada**. En un spec temporal (`src/catalog/tmp-axios.spec.ts`, borrado; su
código está al principio de `docs/d2-axios.txt`) se escribió un
`getCoffeesAxios` igual que `getCoffees` pero con `axios.get(url, { headers:
{ Accept: 'application/json' }, validateStatus: () => true })` y el mismo
`switch`, y se le pasaron los casos de O3 dos veces: con el spy de
`globalThis.fetch` y con MSW. `src/catalog` no se tocó.

| Caso | Spy de `globalThis.fetch` (O3) | MSW (D2) |
| --- | --- | --- |
| 200 → cafés | ❌ `promise rejected "AxiosError: Network Error"` | ✅ |
| cabecera Accept | ❌ `expected "fetch" to be called 1 times, but got 0 times` | ✅ (el handler lee `application/json`) |
| 404 | ❌ `got 'Network Error'` | ✅ |
| 503 | ❌ `got 'Network Error'` | ✅ |
| 500 | ❌ `got 'Network Error'` | ✅ |
| error de red | ❌ `got 'Network Error'` | ❌ `expected error to be instance of TypeError` |

Resultado: `Tests  7 failed | 6 passed (13)`. Con el spy fallan los 6. En
jsdom axios elige el adaptador `xhr` (`adapter: [ 'xhr', 'http', 'fetch' ]`)
y usa el `XMLHttpRequest` de jsdom: no llama nunca a `fetch`, el spy no se
entera y la petición sale de verdad a `http://localhost:3000`, donde no hay
nada (`Network Error`). Con MSW pasan 5 de 6: `setupServer` intercepta
también `XMLHttpRequest`, y al test le da igual cómo se haga la petición.

El que falla con MSW falla **con razón**: con axios el error de red ya no es
un `TypeError` sino un `AxiosError: Network Error`, y el catálogo pasaría a
enseñar "Network Error". Es un cambio de comportamiento real, no del test.

### Spy contra MSW

| | Spy (`vi.spyOn(globalThis, 'fetch')` en O3, `vi.spyOn(api, 'getCoffees')` en O5) | MSW (`setupServer` + handlers) |
| --- | --- | --- |
| Qué se sustituye | La función: `fetch` (O3) o `getCoffees` entero (O5) | El servidor: la petición se intercepta antes de salir del proceso |
| Qué código real se ejecuta | Ni `fetch` ni `Response` de verdad: el spy devuelve una `Response` construida en el test (O3); en O5 tampoco se ejecuta `getCoffees` | `getCoffees`, el `fetch` de Node, la petición (`Request` con sus cabeceras), la `Response` y su `.json()`; en el catálogo, la cadena entera componente → `getCoffees` → `fetch` |
| Qué se comprueba | Cómo se llamó a la función (`toHaveBeenCalledWith('/api/coffees', …)`, `toHaveBeenCalledTimes(1)`) y qué hace el código con lo que devuelve | Lo que llega al "servidor" (método, URL, cabeceras, leídas en el handler) y lo que hace el código con la respuesta; los errores de red son los reales (`fetch failed`) |
| Si cambia la forma de llamar (axios) | Se rompen los 6 tests aunque el comportamiento sea el mismo, y la petición sale a la red de verdad ([docs/d2-axios.txt](docs/d2-axios.txt)) | Siguen pasando 5 de 6; sólo falla el de error de red, que de verdad cambia |
| Cuánto cuesta montarlo | Nada: `vi.spyOn` viene con Vitest y `restoreMocks` lo deshace solo | Una dependencia (`msw`), `handlers.ts` y `server.ts`, y `listen`/`resetHandlers`/`close` en cada fichero (o en `setup.ts`); hay que saber cómo resuelve la URL relativa |
| Cuándo conviene | Para probar un componente aislado de la red (O5: el buscador o el carrito no dependen de cómo se pidan los cafés) | Para probar la integración con la API sin depender de cómo se hace la petición |

## Romper el código (💥)

Cada 💥 es un único cambio en `src/catalog`, con `git diff --exit-code` limpio
antes. La salida es la de `NO_COLOR=1 npx vitest run -c
./config/test/config.ts`. Después se deshace con `git checkout --` y se
comprueba que el diff vuelve a estar limpio y los tests en verde.

Cada salida enlazada es la del momento en que se hizo el 💥, con los tests que
había entonces. En la revisión de O7 se repitieron **todos** de una vez, uno
cada vez y deshaciéndolo, con el código y los 48 tests finales:
[docs/repaso-romper.txt](docs/repaso-romper.txt) (al principio, un resumen
con los tests en rojo de cada uno; detrás, cada salida completa). Todos siguen
poniendo en rojo los tests de esta tabla. En dos filas, con la suite final se
ponen en rojo **más** tests que cuando se escribió la fila (O2-2 y O3): están
señalados como "con la suite final". Los nombres de la tabla son los de
ahora (tres tests cambiaron de nombre en O7: entrada 14 de la bitácora).

| Obligatorio | Qué se cambió | Test(s) en rojo | Salida |
| --- | --- | --- | --- |
| O2 | `cart.ts`, `addToCart`: `{ ...item, quantity: item.quantity + 1 }` → `((item.quantity += 1), item)` | `addToCart > no debería modificar el carrito que recibe cuando el café ya está en él` (falla el `toEqual`: `quantity` 3 en vez de 2) | [docs/o2-romper-1.txt](docs/o2-romper-1.txt) |
| O2 | `cart.ts`, `finalPrice`: `coffee.price * (1 - (coffee.discount ?? 0))` → `coffee.price` | `finalPrice > debería aplicar el descuento cuando el café tiene discount (Etiopía → 13.41)` (14.9) y `cartTotal > debería sumar los precios finales por cantidad cuando hay 2 × Etiopía y 1 × Brasil (37.32)` (40.3). Con la suite final, también `CoffeeCard > debería mostrar el precio final con el descuento aplicado y la etiqueta "-10 %"…` y `CoffeeCatalog > carrito (integración) > debería mostrar "2 bolsas · 23.91 €"…` | [docs/o2-romper-2.txt](docs/o2-romper-2.txt), [docs/repaso-romper.txt](docs/repaso-romper.txt) |
| O3 | `coffee.api.ts`, `case 503:` → `case 502:` | `getCoffees > cuando la API responde con un error > debería rechazar con "Servicio no disponible" cuando la API responde 503` (`expected [Function] to throw error including 'Servicio no disponible' but got 'Error inesperado'`: el 503 cae en el `default`). Con la suite final, también los dos del 503 de MSW (D2): `getCoffees (MSW) > … 503` y `CoffeeCatalog (MSW) > error > debería mostrar la alerta "Servicio no disponible"…` | [docs/o3-romper-1.txt](docs/o3-romper-1.txt), [docs/repaso-romper.txt](docs/repaso-romper.txt) |
| O4 | `coffee-card.tsx`, botón: `onAdd(coffee)` → `onAdd({ ...coffee, price: 0 })` | `CoffeeCard > debería llamar a onAdd una vez y con ese café cuando se pulsa el botón de añadir` (falla el `toHaveBeenCalledWith(colombia)`: el diff marca `- "price": 12.9,` / `+ "price": 0,`; `toHaveBeenCalledTimes(1)` sigue pasando) | [docs/o4-romper-1.txt](docs/o4-romper-1.txt) |
| O4 (O7) | `coffee-card.tsx`, `<h3>{coffee.name}</h3>` → `<h2>{coffee.name}</h2>` | `CoffeeCard > debería mostrar el nombre del café como encabezado de nivel 3 cuando se pinta la tarjeta` (`Unable to find an accessible element with the role "heading" and name "Etiopía Yirgacheffe"`: el `level: 3` ya no casa) | [docs/o4-romper-otros.txt](docs/o4-romper-otros.txt) |
| O4 (O7) | `coffee-card.tsx`, `{coffee.discount ? <p>-{coffee.discount * 100} %</p> : null}` → `<p>-{(coffee.discount ?? 0) * 100} %</p>` (la etiqueta siempre) | `CoffeeCard > no debería mostrar ninguna etiqueta de descuento cuando el café no tiene descuento` (`expected document not to contain element, found <p>`: Colombia enseña `-0 %`) | [docs/o4-romper-otros.txt](docs/o4-romper-otros.txt) |
| O5 | `coffee-catalog.tsx`, `c.name.toLowerCase().includes(…)` → `c.name.includes(…)` | `CoffeeCatalog > buscador > debería mostrar sólo Brasil Cerrado cuando se escribe "bra" en Buscar` y `CoffeeCatalog > buscador > debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas` (`Unable to find an accessible element with the role "listitem"`: `"Brasil Cerrado".includes("bra")` es `false` y se pinta "Sin resultados") | [docs/o5-romper-1.txt](docs/o5-romper-1.txt) |
| O5 🤔 | `coffee-catalog.tsx`, `includes(filter.toLowerCase())` → `includes(filter)`, **con el test de "BRA" saltado** (`it.skip`, temporal) | **Ninguno**: `Tests  30 passed \| 1 skipped (31)` | [docs/o5-romper-2-sin-test.txt](docs/o5-romper-2-sin-test.txt) |
| O5 🤔 | el mismo cambio, con el test de "BRA" activo | `CoffeeCatalog > buscador > debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas` (`Unable to find an accessible element with the role "listitem"`: `"brasil cerrado".includes("BRA")` es `false`) | [docs/o5-romper-2.txt](docs/o5-romper-2.txt) |
| O5 | `coffee-catalog.tsx`, botón: se quita `disabled={units === 0}` | `CoffeeCatalog > carrito (integración) > debería tener "Vaciar carrito" desactivado cuando el carrito está vacío` (`expect(element).toBeDisabled()` / `Received element is not disabled`) | [docs/o5-romper-3.txt](docs/o5-romper-3.txt) |
| O6 | `use-cart.ts`, `add`: `setCart((previous) => addToCart(previous, coffee.id))` → `setCart(addToCart(cart, coffee.id))` | `useCart > debería tener 2 unidades cuando se añade Brasil dos veces dentro del mismo act` (`expected 1 to be 2`: los dos `add` leen el mismo `cart` vacío) | [docs/o6-romper-1.txt](docs/o6-romper-1.txt) |
| P1 | `use-cart.ts`, `remove`: `setCart((previous) => removeFromCart(previous, coffeeId))` → `setCart((previous) => previous)` | `useCart > debería quedarse con 0 unidades, carrito vacío y total 0 cuando se añade Brasil y después se quita` (`expected [ { coffeeId: 3, quantity: 1 } ] to deeply equal []`) y `useCart > debería dejar sólo Colombia (1 unidad, total 12,90) cuando hay Colombia y Brasil y se quita Brasil` (`expected [ { coffeeId: 2, quantity: 1 }, …(1) ] to deeply equal [ { coffeeId: 2, quantity: 1 } ]`) | [docs/p1-romper-1.txt](docs/p1-romper-1.txt) |
| P1 | `use-cart.ts`, `remove`: `setCart((previous) => removeFromCart(previous, coffeeId))` → `setCart([])` | `useCart > debería dejar sólo Colombia (1 unidad, total 12,90) cuando hay Colombia y Brasil y se quita Brasil` (`expected [] to deeply equal [ { coffeeId: 2, quantity: 1 } ]`) | [docs/p1-romper-2.txt](docs/p1-romper-2.txt) |
| P1 🤔 | `cart.ts`, el 💥 de `finalPrice` de O2, con sólo el spec temporal sin `expect` y `--coverage` | **Ninguno**: `Tests  1 passed (1)` y `cart.ts` al 100 % en las cuatro columnas | [docs/p1-sin-asserts.txt](docs/p1-sin-asserts.txt) |
| D2-1 | `coffee.api.ts`, `return data;` → `return [];` (sólo con los specs `.msw`, como todos los D2) | `getCoffees (MSW) > … 200` (`expected [] to deeply equal [ { id: 1, …(4) }, …(2) ]`) y los dos de carga del catálogo (`Unable to find role="listitem"`) | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-2 | `coffee.api.ts`, `fetch(url, { headers: { Accept: 'application/json' } })` → `fetch(url)` | `getCoffees (MSW) > debería mandar la cabecera Accept: application/json…` (`expected '*/*' to be 'application/json'`) | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-3 | `coffee.api.ts`, `if (!response.ok)` → `if (false)` | los tres del `it.each` (`promise resolved "[ { id: 1, …(4) }, …(2) ]" instead of rejecting`) y la alerta del 503 del catálogo | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-4 | `coffee.api.ts`, `fetch(…)` → `fetch(…).catch(() => { throw new Error('Error inesperado'); })` | `getCoffees (MSW) > debería propagar el TypeError "fetch failed"…` (`expected error to be instance of TypeError`) y la alerta de red del catálogo | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-5 | `coffee.api.ts`, `'Servicio no disponible'` → `'Servicio caído'` | el 503 del `it.each` (`but got 'Servicio caído'`) y la alerta del 503 del catálogo | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-6 | `coffee-catalog.tsx`, `useState(true)` → `useState(false)` (loading) | `CoffeeCatalog (MSW) > carga > debería mostrar "Cargando…"…` (`Unable to find an element with the text: Cargando…`) | [docs/d2-romper.txt](docs/d2-romper.txt) |
| D2-7 | `coffee-catalog.tsx`, se quita `.catch((e: Error) => setError(e.message))` | las dos alertas del catálogo (`Unable to find role="alert"`, y Vitest avisa de dos `Unhandled Rejection`) | [docs/d2-romper.txt](docs/d2-romper.txt) |

Con el 💥 1, el test `debería sumar 1 al café y dejar los demás igual…` sigue
en verde: el resultado es correcto, lo que está mal es que el original
también cambia. Con el 💥 2, los dos tests de Colombia siguen en verde: sin
descuento, `coffee.price` y la fórmula dan lo mismo. Con el 💥 de O3, el
404 y el 500 siguen en verde: sus ramas no cambian.
Con el 💥 de O4, los tres tests que sólo miran lo que se pinta siguen en
verde: el HTML no cambia, sólo el objeto que recibe `onAdd`. Un snapshot de
la tarjeta tampoco lo detectaría.

Con el 💥 1 de O5, el test de "zzz" sigue en verde: "zzz" no coincide con
ningún nombre, esté en minúsculas o no.

**🤔 ¿Y si se quita el `.toLowerCase()` de `filter`?** Con los tests del
enunciado no falla ninguno, porque el único texto que se escribe con letras
que coinciden es "bra", que ya está en minúsculas: `filter` y
`filter.toLowerCase()` valen lo mismo, y sobre "zzz" da igual. El código sólo
se porta mal cuando la persona usuaria escribe con mayúsculas, y ningún test
lo hacía. El test que lo detecta escribe "BRA" y espera Brasil Cerrado:
antes del 💥 pasa (`"brasil cerrado".includes("bra")`), y con el 💥 no
(`"brasil cerrado".includes("BRA")`). Así lo demuestran las dos filas de
arriba.

Con el 💥 3 de O5, el test `…activar "Vaciar carrito"…` sigue en verde: sin
`disabled`, el botón siempre está activado. Sólo lo detecta el test del
carrito vacío.

Con el 💥 de O6, el caso 2 (dos `add` en dos `act` seguidos) sigue en
verde, y también el 1 y el 3 (no añaden dos veces). Por qué, en la respuesta
📝 de O6.

Con el 💥 2 de P1, el primer test de `remove` sigue en verde: con un solo
café en el carrito, "quitar Brasil" y "vaciarlo todo" dan lo mismo. Con el
🤔 de P1 no falla nada porque el spec no comprueba nada (ver "Por qué un
100 % no quiere decir bien probado").

### 🪤 El test del try/catch

Para no tocar el spec bueno, se hizo en un fichero temporal,
`src/catalog/coffee.api.trampa.spec.ts`, que ya está borrado. El
`(error as Error).message` del enunciado es la única excepción a "nada de
`as`" y se fue con el fichero.

```ts
try {
  await getCoffees();
} catch (error) {
  expect((error as Error).message).toBe('Servicio no disponible');
}
```

| Paso | Mock de `fetch` | Resultado | Salida |
| --- | --- | --- | --- |
| a) try/catch | 503 | ✓ (`Tests  1 passed (1)`) | — |
| b) try/catch | **200** | ✓ **sigue en verde** (`Tests  1 passed (1)`), aunque `getCoffees` ya no falla | [docs/o3-trampa-1.txt](docs/o3-trampa-1.txt) |
| c) try/catch + `expect.assertions(1)` | 200 | × `Error: expected number of assertions to be 1, but got 0` | [docs/o3-trampa-2.txt](docs/o3-trampa-2.txt) |
| d) `await expect(result).rejects.toThrow('Servicio no disponible')` (la del spec bueno) | 200 | × `AssertionError: promise resolved "[ { id: 1, …(4) }, …(2) ]" instead of rejecting` | [docs/o3-trampa-3.txt](docs/o3-trampa-3.txt) |

El mensaje de c) es el de Vitest 5.1.0. El "expected one assertion to be
called but received zero assertion calls" es el de Jest. Por qué pasa lo de
b) y qué arregla c), en la respuesta 📝 de O3. Nos quedamos con la versión
de `rejects` (d): sin añadir nada, se pone en rojo y explica qué ha pasado
(la promesa se resolvió con los cafés).

## Preparación para la revisión

El enunciado avisa de que en la revisión se puede romper el código con un
cambio distinto a los 💥. Se probaron estos nueve, cada uno por separado: un
único cambio en `src/catalog`, `NO_COLOR=1 npx vitest run -c
./config/test/config.ts` con los 48 tests finales y `git checkout --` del
fichero, comprobando después que `git diff --exit-code` de los 7 ficheros
del enunciado sale limpio. R9 lo añadí yo: es el test en directo "que
`removeFromCart` no modifica el carrito" convertido en un fallo.

| # | Cambio | Tests en rojo | Salida |
| --- | --- | --- | --- |
| R1 | `cart.ts`, `formatPrice`: `toFixed(2)` → `toFixed(1)` | 5: los dos de `formatPrice` (`expected '14.9 €' to be '14.90 €'`), el del precio de la tarjeta (`13.4 €`), y en el catálogo "2 bolsas · 23.91 €" y "0 bolsas · 0.00 €" | [docs/revision-1.txt](docs/revision-1.txt) |
| R2 | `cart.ts`, `removeFromCart`: `!==` → `===` | 3: `removeFromCart > debería quitar el café indicado y dejar los demás…` y los dos de `remove` de `useCart` (P1) | [docs/revision-2.txt](docs/revision-2.txt) |
| R3 | `cart.ts`, `cartTotal`: `finalPrice(coffee) * item.quantity` → `finalPrice(coffee)` | 2: `cartTotal > … 2 × Etiopía y 1 × Brasil (37.32)` (`expected 23.91 to be close to 37.32`) y `useCart > debería tener 2 unidades y un total de 21…` (10.5). El "2 bolsas" de O5 **no**: allí cada café va una vez y `× 1` no cambia nada | [docs/revision-3.txt](docs/revision-3.txt) |
| R4 | `cart.ts`, `addToCart`: `{ coffeeId, quantity: 1 }` → `quantity: 0` | 5: `addToCart > debería añadir el café con cantidad 1 cuando el carrito está vacío`, tres de `useCart` (2 unidades en dos `act`, en el mismo `act`, y el de Colombia y Brasil) y "2 bolsas · 23.91 €" del catálogo | [docs/revision-4.txt](docs/revision-4.txt) |
| R5 | `coffee.api.ts`: `{ headers: { Accept: 'application/json' } }` → `{ headers: {} }` | 2: `getCoffees > debería llamar a fetch una vez con "/api/coffees" y la cabecera Accept…` (O3, el `objectContaining`) y `getCoffees (MSW) > debería mandar la cabecera Accept…` (D2, `expected '*/*' to be 'application/json'`) | [docs/revision-5.txt](docs/revision-5.txt) |
| R6 | `coffee-card.tsx`: se borra la línea `{coffee.discount ? <p>-{…} %</p> : null}` | 1: `CoffeeCard > debería mostrar el precio final con el descuento aplicado y la etiqueta "-10 %"…` (`Unable to find an element with the text: -10 %`). El de "sin descuento" sigue en verde, con razón: no hay etiqueta | [docs/revision-6.txt](docs/revision-6.txt) |
| R7 | `coffee-catalog.tsx`: `<p role="alert">` → `<p>` | 3: `CoffeeCatalog > error > debería mostrar una alerta con el mensaje del error…` (O5) y las dos alertas de MSW (D2): `Unable to find role="alert"`. El texto sigue en pantalla, pero un lector de pantalla ya no lo anuncia | [docs/revision-7.txt](docs/revision-7.txt) |
| R8 | `use-cart.ts`: `clear = () => setCart([])` → `setCart((previous) => previous)` | 2: `useCart > debería quedarse con 0 unidades cuando se añade un café y después se vacía el carrito` (`expected 1 to be +0`) y `CoffeeCatalog > … debería volver a "0 bolsas · 0.00 €"…` | [docs/revision-8.txt](docs/revision-8.txt) |
| R9 | `cart.ts`, `removeFromCart` con `cart.splice(index, 1)` sobre el carrito recibido y `return [...cart]` | **Ninguno** con los 47 tests de antes ([docs/revision-9-sin-test.txt](docs/revision-9-sin-test.txt): `Tests  47 passed (47)`). Con el test nuevo, 1: `removeFromCart > no debería modificar el carrito que recibe cuando quita un café` (`expected [ { coffeeId: 1, quantity: 1 } ] to deeply equal [ { coffeeId: 1, quantity: 1 }, …(1) ]`) | [docs/revision-9.txt](docs/revision-9.txt) |

Los ocho cambios que se pedían los detecta al menos un test. El que no se
detectaba es R9: el resultado de `removeFromCart` es correcto y es un array
nuevo, así que el test de `cart.spec.ts` (`toEqual` sobre el resultado) y
los de `useCart` (React ve otro array y vuelve a pintar) siguen en verde.
Lo único que está mal es que el carrito que se pasó también ha cambiado, y
eso sólo lo ve un test que guarde una copia antes. Lo añadí (bitácora,
entrada 15).

### Los dos tests en directo del enunciado

**"Que `removeFromCart` no modifica el carrito"**: ya está, en
[cart.spec.ts:138](lab-testing/src/catalog/cart.spec.ts#L138) (añadido en
esta revisión, por R9). En directo lo escribiría igual que el de
`addToCart` ([cart.spec.ts:100](lab-testing/src/catalog/cart.spec.ts#L100)):

```ts
it('no debería modificar el carrito que recibe cuando quita un café', () => {
  // Arrange
  const cart: CartItem[] = [
    { coffeeId: ethiopia.id, quantity: 1 },
    { coffeeId: colombia.id, quantity: 2 },
  ];
  const original = structuredClone(cart);

  // Act
  const result = removeFromCart(cart, colombia.id);

  // Assert
  expect(cart).toEqual(original);
  expect(result).not.toBe(cart);
});
```

1. Arrange: un carrito con **dos** cafés (si sólo tiene el que se quita, no
   queda nada que comparar) y la copia profunda con `structuredClone`, antes
   del Act (una copia con `[...cart]` compartiría los objetos).
2. Act: quitar uno que esté.
3. Assert: el original sigue igual que la copia (`toEqual`, contenido) y el
   resultado es otro array (`not.toBe`, referencia).
4. Verlo fallar: R9 de la tabla (o simplemente `cart.splice(1, 1)` antes del
   `filter`) y `git checkout --` después.

**"Que el buscador no distingue mayúsculas"**: ya está, en
[coffee-catalog.spec.tsx:87](lab-testing/src/catalog/coffee-catalog.spec.tsx#L87)
(`debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas`,
la respuesta al 🤔 de O5). En directo:

1. Arrange: `vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees)`,
   `userEvent.setup()`, `render(<CoffeeCatalog />)` y `await
   screen.findByLabelText('Buscar')` (el campo aparece después de la
   promesa: `findBy`).
2. Act: `await user.type(search, 'BRA')`.
3. Assert: `screen.getAllByRole('listitem')` tiene longitud 1 y
   `within(items[0]).getByRole('heading', { name: 'Brasil Cerrado' })` está.
4. Verlo fallar: quitar el `.toLowerCase()` de `filter` (O5-2) o el de
   `c.name` (O5-1).

La clave es escribir en mayúsculas lo que el nombre tiene en minúsculas. Con
"bra" el test no detecta el fallo de `filter`
([docs/o5-romper-2-sin-test.txt](docs/o5-romper-2-sin-test.txt)).

## Estructura

```
06-Testing/
├── lab.md            ← enunciado
├── prompts.md        ← los prompts de Claude Code, uno por obligatorio
├── README.md         ← este fichero
├── bitacora.md       ← bitácora de IA
├── docs/             ← salidas de type-check y vitest (.txt) que prueban cada paso
│                       (O7: vitest-final, orden-aleatorio, repaso-romper y revision-1…9)
└── lab-testing/      ← copia de 06-testing/.start-code (React + TypeScript + Vite)
    ├── index.html    ← <div id="root"> y carga src/index.tsx
    ├── package.json  ← scripts start, type-check, test, test:run y test:coverage (P1)
    ├── coverage/     ← informe de cobertura (lo genera test:coverage; en el .gitignore)
    ├── tsconfig.json ← con los dos arreglos de arriba; include con config/test
    ├── config/test/
    │   ├── config.ts   ← configuración de Vitest (globals, restoreMocks, jsdom, setupFiles y coverage de P1)
    │   ├── config.d.ts ← tipos de los globals de Vitest para tsc
    │   └── setup.ts    ← carga los matchers de jest-dom antes de cada fichero de test
    └── src/
        ├── index.tsx ← monta <App /> en #root
        ├── app.tsx   ← componente de ejemplo del .start-code (sólo un <h1>)
        └── catalog/  ← el código que se prueba, copiado tal cual del enunciado
            ├── model.ts           ← interfaces Coffee y CartItem
            ├── cart.ts            ← funciones puras: formatPrice, finalPrice, addToCart, removeFromCart, cartTotal
            ├── cart.spec.ts       ← O2: 12 tests de las funciones del carrito; O7: 1 más (removeFromCart no muta)
            ├── coffee.api.ts      ← getCoffees: fetch a /api/coffees y un error por cada estado
            ├── coffee.api.spec.ts ← O3: 6 tests de getCoffees con fetch espiado
            ├── coffee-card.tsx    ← CoffeeCard: nombre, origen, precio, descuento y botón Añadir
            ├── coffee-card.spec.tsx ← O4: 4 tests de la tarjeta con render, screen y userEvent
            ├── use-cart.ts        ← useCart: estado del carrito, units, total, add, remove y clear
            ├── use-cart.spec.ts   ← O6: 4 tests del hook con renderHook y act; P1: 2 más de remove
            ├── coffee-catalog.tsx ← CoffeeCatalog: carga, error, buscador y carrito (no se monta en index.tsx)
            ├── coffee-catalog.spec.tsx ← O5: 9 tests del catálogo con getCoffees espiado (carga, error, buscador y carrito)
            ├── coffee.api.msw.spec.ts ← D2: 6 tests de getCoffees con MSW (los casos de O3)
            ├── coffee-catalog.msw.spec.tsx ← D2: 4 tests de carga y error del catálogo con MSW, sin vi.spyOn
            ├── mocks/
            │   ├── handlers.ts    ← D2: GET /api/coffees → { data: coffees }
            │   └── server.ts      ← D2: setupServer(...handlers)
            └── test-data.ts       ← los tres cafés de prueba que usan todos los tests
```

## Checklist

### Obligatorios
- [x] O1 · Configurar Vitest
- [x] O2 · Funciones puras: el carrito
- [x] O3 · Código asíncrono: la llamada a la API
- [x] O4 · Un componente presentacional: la tarjeta
- [x] O5 · Un componente con datos: el catálogo
- [x] O6 · Un custom hook: useCart
- [x] O7 · README + bitácora de IA

### Opcionales
- [x] P1 · Cobertura
- [ ] P2 · Snapshots: a favor y en contra
- [ ] P3 · Temporizadores falsos
- [ ] P4 · Context: un carrito compartido
- [ ] P5 · Probad vuestro laboratorio de React
- [ ] P6 · Depurar un test

### Desafíos
- [ ] D1 · TDD: primero el test
- [x] D2 · Simular la red con MSW
- [ ] D3 · Los tests en cada push

Sin marcar porque no están hechos. En el repo no hay ningún fichero a medias
de ellos (comprobado con `find`: ni `use-offer-countdown.ts` de P3, ni
`cart-context.tsx` de P4, ni `coupon.ts` de D1, ni `.github/workflows/` de
D3, ni capturas `p6-breakpoint.png` o `d3-pr-rojo.png`, ni ningún
`toMatchSnapshot` o `__snapshots__/` de P2). P5 no se hace en este lab
porque tocaría el lab 4 (`04-Frameworks/lab-react`), y la regla es no
modificar dos entregables a la vez.

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

### O2

**¿Por qué las funciones puras (laboratorio 2) son las más fáciles de probar? ¿Qué habéis tenido que preparar en el Arrange?**

Una función pura sólo depende de sus argumentos y sólo produce su valor de
retorno. No lee nada de fuera (ni red, ni reloj, ni DOM, ni estado global) y
no cambia nada de fuera (ni siquiera lo que recibe). Por eso el test es
siempre el mismo: unos datos, una llamada y un `expect` sobre lo que
devuelve. No hace falta jsdom, ni `render`, ni `await`, ni mockear nada, y
el resultado no depende del orden de los tests ni de la máquina. Los 12
tests de O2 en `cart.spec.ts` tardan entre 0 y 2 ms cada uno
([docs/o2-verde.txt](docs/o2-verde.txt)). Y cuando uno falla, el mensaje
apunta directamente a la función: `expected 14.9 to be close to 13.41`.

Lo único que hay que preparar en el Arrange son las entradas:

- **Los cafés**: los tres de `test-data.ts`, desestructurados como
  `ethiopia`, `colombia` y `brazil`, que no se modifican nunca. El catálogo
  completo (`coffees`) se pasa a `cartTotal`. El único café que no está en
  `test-data.ts` es `{ ...colombia, discount: 0 }`, y se construye en su
  propio Arrange con spread, sin tocar `colombia`.
- **Los carritos**: cada test escribe el suyo como un array literal
  (vacío, `[{1, 2}, {3, 1}]`…). Así ninguno comparte un carrito que otro
  pueda haber cambiado, y aunque `addToCart` mutase (💥 1) no afectaría a
  los demás tests.
- **Un `coffeeId` que no existe** (`99`) para comprobar que `cartTotal` lo
  cuenta como 0.
- **La copia para la mutación**: `structuredClone(cart)` antes del Act. Tiene
  que ser profunda, porque el 💥 1 muta el item, no el array, y una copia
  con `[...cart]` compartiría ese item y cambiaría con él (ver O2 arriba).

### O3

**¿Por qué no queremos que los tests llamen a la API de verdad? Dad al menos dos motivos.**

- **Resultados que no dependen de nada externo.** Con la API real, el test
  depende de que el servidor esté levantado, de la red y de los datos que
  tenga ese día. Si alguien añade un café, el `toEqual(coffees)` falla
  aunque `getCoffees` esté bien. Con el spy, la respuesta es siempre la que
  escribe el test, y si falla es porque `getCoffees` ha cambiado.
- **Poder provocar cualquier caso cuando queremos.** Un servidor que
  funciona no da un 503 ni un 500 cuando queremos, y un fallo de red no se
  provoca desde un test. Con `mockResolvedValue(new Response(..., { status:
  503 }))` o `mockRejectedValue(new TypeError('Failed to fetch'))`, cada rama
  del `switch` y el `TypeError` se prueban en una línea. Sin eso, la mitad de
  la tabla de O3 no se podría probar.
- **Velocidad.** Los 6 tests de O3 tardan entre 0 y 4 ms cada uno
  ([docs/o3-verde.txt](docs/o3-verde.txt)): no hay red, ni espera, ni
  servidor que arrancar. Con peticiones reales, cada test tardaría lo que
  tarde la red, y en un `npm test` en modo vigilancia eso se nota.
- **No tocar datos reales.** Un test de `createCoffee` o `deleteCoffee`
  contra la API real crearía o borraría datos de verdad (en el lab 5, los
  hoteles del servidor en memoria quedaban cambiados después de cada prueba).
  Y no hacen falta credenciales ni un servidor en la CI.

Lo que se pierde es comprobar que el servidor de verdad responde lo que
creemos (`{ data: [...] }`, esos estados). Eso es trabajo de un test de
integración o de contrato, no de este test unitario.

**¿Qué pasaba en el test del try/catch y qué hace `expect.assertions(1)`?**

El único `expect` del test estaba dentro del `catch`. Con el mock en 200,
`getCoffees()` se resuelve con los tres cafés, el `await` no lanza nada y el
`catch` **no se ejecuta**. El test termina sin haber ejecutado ningún
`expect`, y para Vitest un test que no lanza ningún error es un test que
pasa: `✓ … debería rechazar con "Servicio no disponible" cuando la API
responde 503` y `Tests  1 passed (1)`
([docs/o3-trampa-1.txt](docs/o3-trampa-1.txt)). El nombre dice que rechaza,
el código ya no rechaza, y el test sigue en verde: no comprueba nada.

`expect.assertions(1)` le dice a Vitest que, al acabar el test, tiene que
haberse ejecutado **exactamente un** `expect`. Si no, el test falla aunque no
se haya lanzado nada. Con el 200, el `catch` sigue sin ejecutarse, se han
hecho 0 aserciones, y el test se pone rojo con `Error: expected number of
assertions to be 1, but got 0`
([docs/o3-trampa-2.txt](docs/o3-trampa-2.txt)). Arregla la trampa, pero hay
que acordarse de ponerlo y de cambiar el número si se añade otro `expect`.

La versión de `rejects` no necesita nada de eso. `await
expect(result).rejects.toThrow('Servicio no disponible')` falla siempre que
la promesa se resuelva, y además explica qué ha pasado: `promise resolved
"[ { id: 1, …(4) }, …(2) ]" instead of rejecting`
([docs/o3-trampa-3.txt](docs/o3-trampa-3.txt)). Por eso nos quedamos con
ella.

El `await` delante de `expect(...).rejects` también hace falta.
`rejects.toThrow` devuelve una promesa, y sin `await` el test no la espera.
Ese es el riesgo clásico (en Jest, por ejemplo): el test puede acabar antes de
que la aserción falle y quedar en verde (eso no lo he probado aquí). En
Vitest 5.1.0 sí lo he probado ([docs/o3-sin-await.txt](docs/o3-sin-await.txt)) y siempre sale rojo, con
``Error: Promise returned by `expect(actual).rejects.toThrow(expected)` was
not awaited``. Sale así incluso cuando la aserción se cumpliría (mock en
503), y también cuando el 200 llega 50 ms después de que acabe el cuerpo del
test: en ese caso Vitest espera a la aserción pendiente y da los dos
errores, el del 200 y el del `await` que falta. O sea, Vitest 5 lo detecta,
pero el `await` sigue siendo obligatorio: sin él el test no pasa nunca.

### O4

**¿Por qué es mejor `getByRole('button', { name: 'Añadir Colombia Huila al carrito' })` que buscar "el primer button de la tarjeta"? ¿Qué tiene que ver con la accesibilidad?**

"El primer button" (`container.querySelector('button')` o
`getAllByRole('button')[0]`) depende de la **estructura** del HTML, no de lo
que ve el usuario:

- **Si cambia el orden**, por ejemplo con un botón "Ver detalle" antes de
  "Añadir", el test pulsa el botón equivocado. Puede fallar por un motivo
  que no tiene nada que ver con el carrito, o peor, pasar comprobando otra
  cosa.
- **Si hay más botones**, como en el catálogo de O5 (una tarjeta por café, más
  "Vaciar carrito"), "el primero" ya no es el de Colombia. Con el nombre,
  la consulta sigue siendo única: el de Colombia es el único que se llama
  "Añadir Colombia Huila al carrito". Y si un día hay dos con el mismo
  nombre, `getByRole` lanza `Found multiple elements`, que también avisa de
  que algo no cuadra.
- **Sólo se rompe cuando cambia lo que importa.** Se puede cambiar el
  `<li>` por un `<article>`, añadir clases o envolver el botón en un `<div>`
  y el test sigue en verde. Se pone rojo si el botón deja de ser un botón o
  deja de decir de qué café es.

Con la accesibilidad tiene que ver porque `getByRole` + `name` busca igual
que un lector de pantalla. El rol (`button`) y el nombre accesible (aquí, el
texto del botón; si no, su `aria-label` o el `<label>` asociado) son lo que
se anuncia: "Añadir Colombia Huila al carrito, botón". Si un test no
encuentra el botón por su nombre, un lector de pantalla tampoco puede
ofrecerlo. Un `<div onClick>` no tiene rol `button`, y un botón con sólo un
icono no tiene nombre. El test falla justo en esos casos, y obliga a
arreglar la accesibilidad, no el test. También por eso el nombre lleva el
café: con cinco botones "Añadir" iguales, una persona que navega por la
lista de botones no sabría cuál es cuál.

**¿Cuándo usáis `getBy…` y cuándo `queryBy…`?**

- **`getBy…` para lo que tiene que estar** (el `<h3>`, el precio, el
  `-10 %`, el botón). Si no lo encuentra, **lanza** un error, y además
  imprime el DOM que tenía delante, así que el fallo se entiende enseguida.
  También lanza si hay más de uno. El `expect(…).toBeInTheDocument()` de
  detrás es casi redundante, pero deja claro en el Assert qué se comprueba.
- **`queryBy…` para comprobar que algo no está** (la etiqueta de descuento
  de Colombia). Si no lo encuentra, **devuelve `null`** sin lanzar, y
  `expect(null).not.toBeInTheDocument()` pasa. Con `getByText(/%/)`, el test
  sin descuento lanzaría justo cuando el código está bien.
- **`findBy…`** (O5) para lo que **aparece después**, cuando se resuelve una
  promesa: devuelve una promesa y reintenta hasta que aparece o se agota el
  tiempo (1000 ms por defecto). Va siempre con `await`.

Los tres tienen su versión `All` (`getAllBy…`, `queryAllBy…`,
`findAllBy…`) para cuando se esperan varios.

### O5

**¿Por qué aquí necesitáis `findBy…` (con `await`) y en O4 bastaba con `getBy…`?**

Porque aquí lo que se busca no está en el primer render. `CoffeeCard` recibe
el café por props y lo pinta todo en el primer render: cuando `render`
vuelve, el `<h3>`, el precio y el botón ya están en el DOM, así que `getBy`
los encuentra. `CoffeeCatalog` pide los cafés a `getCoffees()` en un
`useEffect`, y esa promesa se resuelve **después**. En el primer render,
`loading` es `true` y sólo existe `<p>Cargando…</p>`; los cafés, el campo
Buscar y los botones aparecen en un render posterior, cuando la promesa se
resuelve y se ejecutan `setCoffees` y `setLoading(false)`. Un `getBy` justo
después del `render` lanzaría `Unable to find…`. `findBy` devuelve una
promesa que reintenta la consulta hasta que aparece el elemento (o pasan
1000 ms), y espera dentro de `act`, así que React aplica esas
actualizaciones sin avisos. Lo único que se busca con `getBy` justo después
del `render` es precisamente "Cargando…", que sí está en el primer render.

**En el caso 4 no habéis mockeado ni el hook ni el carrito. ¿Qué ventaja tiene? ¿Y qué inconveniente?**

- **Ventaja:** prueba lo que ve la persona usuaria: pulsa "Añadir Etiopía…"
  y "Añadir Brasil…" y lee "2 bolsas · 23.91 €". Con eso se comprueba que
  las piezas encajan de verdad: que la tarjeta llama a `onAdd` con el café,
  que el catálogo le pasa el `add` del hook, que el hook usa `addToCart` y
  `cartTotal` con los cafés cargados, y que `formatPrice` da el formato. Un
  mock de `useCart` sólo comprobaría que se llama a una función, no que el
  total sale bien. Además, el test sobrevive a refactorizar: se puede
  cambiar cómo guarda el carrito el hook, renombrar funciones de `cart.ts` o
  pasar el carrito a un Context, y si lo que se ve no cambia, el test sigue
  en verde sin tocarlo. Un test con mocks se rompería con cada uno de esos
  cambios.
- **Inconveniente:** si falla, no dice cuál de las piezas tiene la culpa. Un
  "2 bolsas · 26.81 €" puede venir de `finalPrice`, de `cartTotal`, del hook
  o de la tarjeta, y hay que ir a los tests unitarios (O2, O4, O6) o
  depurar para saberlo. Además es más lento: monta el componente entero,
  espera a la promesa y simula clics con `userEvent`, frente a las llamadas
  directas a funciones de O2. Por eso conviene tener los dos tipos: los
  unitarios dicen dónde está el fallo, y el de integración dice que el
  conjunto funciona.

### O6

**¿Para qué sirve `act`? ¿Qué pasaba en la demo 09 sin él?**

`act` agrupa el código que cambia el estado y, al terminar, espera a que
React aplique esas actualizaciones y vuelva a renderizar. Así el test ve lo
mismo que vería la persona usuaria. `add` sólo llama a `setCart`, y
`setCart` no cambia nada en el momento: deja la actualización en la cola de
React. Dentro de `act`, cuando el callback termina, React vacía la cola,
vuelve a llamar al hook y `renderHook` guarda el objeto nuevo en
`result.current`. Por eso los `expect` van después del `act`.

La demo 09 no está en este repo, así que lo comprobamos nosotros con un spec
temporal sin `act` ([docs/o6-sin-act.txt](docs/o6-sin-act.txt)). Pasan las
dos cosas:

1. Cada `add` imprime `An update to TestComponent inside a test was not
   wrapped in act(...)`. Testing Library activa
   `IS_REACT_ACT_ENVIRONMENT`, así que React espera que cada actualización
   vaya dentro de `act` y avisa cuando no es así.
2. El test lee el valor viejo: `expected +0 to be 2` con dos `add` y
   `expected +0 to be 1` con uno. Cuando se ejecuta el `expect`, React
   todavía no ha vuelto a renderizar, y `result.current` sigue siendo el
   objeto del primer render, con `units` 0.

En esta versión el test no pasa igual: además del aviso, se pone en rojo.

**Según el 💥: ¿por qué el caso 4 detecta el fallo y el caso 2 no?**

Con el 💥, `add` hace `setCart(addToCart(cart, coffee.id))`: usa el `cart`
que tenía el hook en el render en el que se creó ese `add`, no el último
valor. Es la trampa de "sumar tres" (`setCount(count + 1)` tres veces suma
1).

- **Caso 4** (los dos `add` en el mismo `act`): entre una llamada y otra no
  hay render. Las dos son el `add` del primer render y las dos leen el mismo
  `cart` viejo, `[]`. Las dos calculan `addToCart([], 3)` →
  `[{ coffeeId: 3, quantity: 1 }]` y la segunda pisa a la primera con el
  mismo valor. Resultado: `expected 1 to be 2`
  ([docs/o6-romper-1.txt](docs/o6-romper-1.txt)). Con el código bueno,
  `setCart((previous) => …)` encola funciones, y React las aplica en orden
  pasando a cada una el resultado de la anterior: `[]` → cantidad 1 →
  cantidad 2.
- **Caso 2** (dos `act` seguidos): al terminar el primer `act`, React
  vuelve a renderizar. `result.current` pasa a ser un objeto nuevo, con un
  `add` nuevo que ve el `cart` ya actualizado
  (`[{ coffeeId: 3, quantity: 1 }]`). El segundo `act` llama a ese `add`
  nuevo, así que suma bien y llega a 2. El 💥 sólo se nota cuando hay
  varias actualizaciones en el mismo render, y eso es justo lo que hace el
  caso 4. En el navegador pasaría con dos `setCart` en el mismo evento; con
  dos clics separados no, porque entre uno y otro hay un render.

## Bitácora de IA

El mismo contenido que [bitacora.md](bitacora.md), con el formato del
enunciado (`### Prompt`, `### Qué me dio`, `### Qué corregí y por qué`). Cada
entrada cita su prompt de [prompts.md](prompts.md) y dice si los tests
fallaban al romper el código.

Herramienta: Claude Code en VS Code (dentro del DevContainer), con los prompts
de [prompts.md](prompts.md).

---

**1 · `createRoot` no pide un `Element`**

### Prompt

"src/index.tsx: document.getElementById('root')!. Explícame qué tipo devuelve
getElementById y por qué el modo estricto obliga." (prompt 0 de `prompts.md`).

### Qué me dio

Una explicación de memoria, antes de instalar nada: "`createRoot` pide un
`Element`", y la escribió así en el README.

### Qué corregí y por qué

Después del `npm install`, quité el `!` en una copia del proyecto y lancé
`tsc --noEmit`. El error real dice `parameter of type 'Container'`, y en
`@types/react-dom/client.d.ts` `Container` es
`Element | DocumentFragment | Document`. La idea era correcta (`null` no
cabe), pero el tipo no. Corregí el README y añadí los errores tal cual salen
de `tsc`.

**¿Los tests fallaban al romper el código?** No aplica: es del prompt 0 y todavía no había ningún test.

---

**2 · "El lock no va a cambiar"**

### Prompt

"NO ejecutes npm install todavía: dime qué comando vas a lanzar y espera a que
te lo confirme." (prompt 0 de `prompts.md`).

### Qué me dio

Al pedir la confirmación dijo: "Con el lock instalará exactamente esas
versiones, sin añadir nada".

### Qué corregí y por qué

Las versiones sí son las mismas (React 19.2.7, TypeScript 6.0.3, Vite 8.1.0,
205 paquetes), pero `npm install` reescribió `package-lock.json`, que pasó de
109457 a 109051 bytes. Como aún no estaba en git, no se puede hacer un diff
con el original. En el lock nuevo no queda ninguna marca `"peer": true`; lo
más probable es que el `.start-code` se generase con otra versión de npm (el
contenedor tiene npm 10.9) y que npm 10 haya quitado esas marcas, pero no lo
he podido comprobar. Lo apunto como lo que es: una suposición. A partir de
aquí, el commit del prompt 0 (`c2fc696 L6 - Setup`; en `prompts.md` se
sugería `L6 - Preparacion`) lleva el lock reescrito, y cualquier
cambio posterior se verá con `git diff package-lock.json`.

**¿Los tests fallaban al romper el código?** No aplica: es del prompt 0 y todavía no había ningún test.

---

**3 · El `tsconfig.json` reformateado de rebote**

### Prompt

"Añade config/test/config.d.ts y config/test/setup.ts al include del
tsconfig.json, y comprueba que los futuros src/**/*.spec.ts(x) también
entran en el type-check." (prompt 1 de `prompts.md`).

### Qué me dio

Para añadir el `include` (y los scripts del `package.json`), Claude leyó el
JSON con Node, lo modificó y lo volvió a escribir con
`JSON.stringify(t, null, 2)`. El `include` quedó bien, pero el diff también
cambiaba `"paths": { "#*": ["./src/*"] }`, que pasó a ocupar tres líneas,
sin que nadie lo hubiera pedido.

### Qué corregí y por qué

Lo vio en el `git diff` antes de seguir. Volvió al `tsconfig.json` de antes
(guardado en el scratchpad) y cambió sólo la línea del `include`. Ahora el
diff del `tsconfig.json` es únicamente el `include`. Un cambio de formato
que nadie ha pedido hace más difícil revisar el diff, y en este lab el
`tsconfig.json` es justo uno de los ficheros que hay que poder defender
línea a línea. En el `package.json`, `JSON.stringify` no cambió nada más que
los dos scripts.

**¿Los tests fallaban al romper el código?** No aplica: es configuración de O1, antes del primer test.

---

**4 · "14.9 * 0.9 da 13.410000000000002"**

### Prompt

"toBe para strings y números exactos, toEqual para arrays y objetos,
toBeCloseTo para decimales. Explica en un comentario sólo donde no sea obvio
(p. ej. por qué 14.9 * 0.9 necesita toBeCloseTo: comprueba con node -e cuánto
da de verdad y pon el valor en el comentario)." (prompt 2 de `prompts.md`).

### Qué me dio

Escribió el comentario de memoria, antes de ejecutar `node -e`: "14.9 * (1 -
0.1) da 13.410000000000002 en JavaScript, no 13.41: con toBe fallaría". En el
de `cartTotal` puso "37.32000000000001".

### Qué corregí y por qué

Al ejecutar `node -e` salió `13.41` y `37.32`, y `14.9 * (1 - 0.1) === 13.41`
da `true` (con `toPrecision(20)` los dos son `13.410000000000000142`, el mismo
double). Con estos números, `toBe` pasaría. El enunciado dice lo contrario
("no da exactamente 13.41"), pero la cuenta da justo el double más cercano a
13.41. El que no cuadra es otro, por ejemplo `0.1 + 0.2`, que da
`0.30000000000000004`. Cambié los dos comentarios para que digan lo que se
ha comprobado. `toBeCloseTo` se queda: no hace falta porque falle `toBe`,
sino porque un resultado con decimales no tiene por qué ser exacto, y el
test no puede depender de que el redondeo caiga bien. Lo mismo va en el
README (O2).

**¿Los tests fallaban al romper el código?** Sí. Lo que estaba mal era el comentario, no el test: con el 💥 2 de O2
(`finalPrice` sin descuento) los dos `toBeCloseTo` se pusieron en rojo
(`expected 14.9 to be close to 13.41` y `expected 40.3 to be close to 37.32`,
[docs/o2-romper-2.txt](docs/o2-romper-2.txt)).

---

**5 · Dos llamadas a `getCoffees` para dos `rejects`**

### Prompt

"Error de red: mockRejectedValue(new TypeError('Failed to fetch')) → el error
llega tal cual (comprueba el tipo y el mensaje)." (prompt 3 de `prompts.md`).

### Qué me dio

En la lista de casos que propuso (y que se aprobó), para el error de red
dijo que haría dos `await expect(getCoffees()).rejects`, cada uno "con su
propia llamada a `getCoffees()`", porque "cada `rejects` necesita su
promesa".

### Qué corregí y por qué

Eso no es así: una promesa ya rechazada se puede esperar todas las veces
que se quiera, y siempre da el mismo error. Al escribir el test, guardó una
sola promesa en el Act (`const result = getCoffees()`) y pasó la misma a
`rejects.toThrow(TypeError)` y a `rejects.toThrow('Failed to fetch')`. Así
`fetch` se llama una vez, como en la vida real, y el test tiene el mismo
Arrange / Act / Assert que los demás. Se avisó del cambio respecto a la lista
aprobada. Que el `toThrow(TypeError)` hace falta se comprobó con un 💥 que
envuelve el error de red en un `Error` con el mismo mensaje: sólo ese
`expect` se pone rojo ([docs/o3-romper-otros.txt](docs/o3-romper-otros.txt)).

**¿Los tests fallaban al romper el código?** Sí, y gracias al segundo `expect`: con el 💥 que envuelve el error de red en
un `Error` con el mismo mensaje, sólo se pone rojo el `toThrow(TypeError)`.
Con el `toThrow('Failed to fetch')` solo, el test habría seguido en verde.

---

**6 · La prueba de `Response` sin la config de test**

### Prompt

"Comprueba que en el entorno jsdom Response existe y funciona (lo da Node,
no jsdom); si no, dímelo antes de buscar otra solución." (prompt 3 de
`prompts.md`).

### Qué me dio

Un spec temporal ejecutado con `npx vitest run <fichero>`, sin `-c
./config/test/config.ts`. Falló con `ReferenceError: it is not defined`. No
era un problema de `Response`: sin la config no había `globals` ni jsdom.
Después lo repitió con la config y un `console.log`, que no salió en la
salida de `vitest run`, así que la prueba no demostraba nada.

### Qué corregí y por qué

Lo volvió a ejecutar con `-c ./config/test/config.ts` y cambió el
`console.log` por expects: `typeof window` es `'object'` (el entorno es
jsdom), `ok` es `false` y `status` 503 con un 503, `json()` devuelve el
cuerpo, y una segunda lectura rechaza con `Body is unusable`. Sólo con
expects que pasan la comprobación vale de algo. Y la segunda lectura
confirma por qué cada test crea su propio `Response`.

**¿Los tests fallaban al romper el código?** La prueba con `console.log` no se habría puesto roja nunca, porque no tenía
ningún `expect`: no comprobaba nada. Con los expects, sí. Los tests de O3
que se apoyan en esa prueba se ponen en rojo con sus 💥
([docs/o3-romper-otros.txt](docs/o3-romper-otros.txt)).

---

**7 · El spec de la tarjeta sin `import React`**

### Prompt

"Escribe los tests: render de @testing-library/react y screen para buscar
[…] Ejecuta en verde (docs/o4-verde.txt) y npm run type-check limpio."
(prompt 4 de `prompts.md`).

### Qué me dio

Un `coffee-card.spec.tsx` que importaba `render`, `screen`, `userEvent`,
`CoffeeCard` y los cafés, pero no `React`. Al ejecutarlo fallaron los 4 tests
con `ReferenceError: React is not defined` en la línea del `render(<CoffeeCard
… />)`. Había dado por hecho el runtime automático de JSX (React 17+), que no
necesita el import.

### Qué corregí y por qué

El `tsconfig.json` del `.start-code` tiene `"jsx": "react"` (runtime clásico:
`<CoffeeCard />` se convierte en `React.createElement(CoffeeCard, …)`), y la
config de Vitest no carga `@vitejs/plugin-react`, así que en los tests nadie
cambia eso. Añadí `import React from 'react'`, que es lo que hacen todos los
ficheros de `src/` (`coffee-card.tsx` incluido), en vez de tocar el
`tsconfig.json` o la config de test. Los 4 tests pasaron sin ningún otro
cambio. No era un fallo del test sino del fichero: lo cuento porque lo dio
por bueno sin mirar cómo compila el proyecto el JSX.

**¿Los tests fallaban al romper el código?** Fallaban, pero por un motivo que no tenía que ver con el 💥: los 4 estaban
en rojo con `ReferenceError` antes de romper nada. Un test que falla por un
error del propio fichero no demuestra nada. Con el import, el 💥 de O4 sólo
pone en rojo el de `onAdd` ([docs/o4-romper-1.txt](docs/o4-romper-1.txt)),
y los otros tres no se vieron fallar con un cambio en el código hasta O7
(entrada 16).

---

**8 · "No sale ningún aviso de act" (sí salía)**

### Prompt

"Revisa que no salga ningún aviso "not wrapped in act(...)" en la salida; si
sale, explícame de qué test viene y arréglalo esperando a lo que
corresponda." (prompt 5 de `prompts.md`).

### Qué me dio

El test `debería mostrar "Cargando…" cuando getCoffees todavía no ha
respondido` acababa con un `await screen.findAllByRole('listitem')` para
evitar el aviso. Quise comprobar si hacía falta: lo quité, ejecuté
`npx vitest run`, no vi ningún aviso en la salida y concluí que la espera
sobraba. Lo justifiqué con que el `cleanup` desmontaba el componente antes de
que llegara la promesa, y lo escribí así en el README y en esta bitácora.

### Qué corregí y por qué

Antes de darlo por bueno comprobé el orden con un spec temporal que apuntaba
cada paso en un fichero: la promesa se resuelve **antes** del `afterEach`,
con `<p>Cargando…</p>` todavía montado, y `console.error` se llamaba dos
veces. La salida estaba limpia porque **Vitest 5 no enseña la consola de los
tests que pasan**; con `--silent=false` aparecen los dos avisos `An update to
CoffeeCatalog inside a test was not wrapped in act(...)` (`setCoffees` y
`setLoading`), en [docs/o5-sin-esperar-carga.txt](docs/o5-sin-esperar-carga.txt).
Volví a poner la espera, con un comentario que explica por qué está, y
regeneré `docs/o5-verde.txt` con `--silent=false`: ya no sale el aviso de act.
La lección: que no salga nada en la salida no prueba nada si la herramienta no
enseña esa salida; hay que mirar primero si la enseña. Al ejecutar así la
suite entera apareció también un aviso escondido en O4 (`outdated JSX
transform`), que contradice el "sin avisos en consola" del README de O4.

**¿Los tests fallaban al romper el código?** Los tests pasaban con la espera y sin ella: lo que no se veía era el aviso,
no un fallo. Los 💥 de O5 se detectaron igual en los dos casos.

---

**9 · "Sin avisos en consola" en O4, mirado donde no se veían**

### Prompt

"Ejecuta en verde (docs/o4-verde.txt) y npm run type-check limpio." (prompt 4
de `prompts.md`; el fallo salió al hacer el prompt 5).

### Qué me dio

En el README de O4 escribí que la ejecución "no muestra ningún bloque
`stderr` ni aviso de `validateDOMNesting`" y que estaba "sin avisos en
consola", apoyándome en `docs/o4-verde.txt`. Con eso justificaba que no
hacía falta un `<ul>` alrededor de la tarjeta.

### Qué corregí y por qué

Al descubrir en O5 que Vitest 5 esconde la consola de los tests que pasan
(entrada 8), repetí el spec de O4 con `--silent=false`
([docs/o4-consola.txt](docs/o4-consola.txt)). Sí había un bloque `stderr`:
`Your app (or one of its dependencies) is using an outdated JSX transform`,
por el `"jsx": "react"` del `tsconfig.json`. La conclusión sobre el `<li>`
sigue siendo cierta (no hay ningún `validateDOMNesting`), pero la prueba que
di no demostraba nada. Corregí las dos frases del README de O4 para que
digan lo que se ve de verdad y enlacen la salida buena; `o4-verde.txt` se
queda como estaba, sólo como prueba de que los tests pasan.

**¿Los tests fallaban al romper el código?** No aplica a los 💥: era una afirmación del README sobre la consola. Y la
explicación que di en esta entrada (que Vitest 5 esconde la consola) tampoco
era del todo cierta: entrada 13.

---

**10 · "React lanza `Invalid hook call`" (y el 💥 que deja tres tests en verde)**

### Prompt

"README: \"## O6 · useCart\": cada test y por qué renderHook." y "💥 Rompe el
código […] Tiene que ponerse rojo el caso 4 (dos add en el mismo act) y no
el 2." (prompt 6 de `prompts.md`).

### Qué me dio

1. En el README, para justificar `renderHook`, escribí de memoria que si se
   llama `useCart(coffees)` fuera de un componente "React lanza `Invalid
   hook call`".
2. Con el 💥 del enunciado (`setCart(addToCart(cart, coffee.id))`) se pone
   en rojo sólo el caso 4. Los casos 1, 2 y 3 siguen en verde
   ([docs/o6-romper-1.txt](docs/o6-romper-1.txt)). Era lo que se buscaba
   (que el 2 no fallara), pero con eso esos tres tests míos no se habían
   visto fallar nunca.

### Qué corregí y por qué

1. Lo probé con un spec temporal (ya borrado). React no lanza ese error:
   lo escribe en consola (`Invalid hook call. Hooks can only be called
   inside of the body of a function component…`). Lo que hace fallar el
   test es otro error, `TypeError: Cannot read properties of null (reading
   'useState')`. Cambié la frase del README para que diga las dos cosas tal
   como salen.
2. Hice 4 💥 más en `use-cart.ts`, uno cada vez y deshecho con `git
   checkout --` ([docs/o6-romper-otros.txt](docs/o6-romper-otros.txt)), y
   cada test se puso en rojo al menos una vez: estado inicial con un café a
   cantidad 0 (caso 1, por el `toEqual([])`), `units = cart.length` (casos
   2 y 4), `cartTotal(cart, [])` (caso 2, por el `toBeCloseTo(21)`) y
   `clear` que no vacía (caso 3). El del estado inicial demuestra que el
   `toEqual([])` del caso 1 sirve para algo: `units` y `total` seguían a 0 y
   sólo falló esa línea.

**¿Los tests fallaban al romper el código?** Con el 💥 del enunciado, no: los casos 1, 2 y 3 seguían en verde y ninguno
se había visto fallar. Con los 4 💥 de más, cada uno se puso en rojo al
menos una vez.

---

**11 · Las salidas de P1 en la carpeta equivocada**

### Prompt

"Ejecuta npm run test:coverage y guarda la tabla de texto en
docs/p1-cobertura-antes.txt (NO_COLOR=1)." (prompt P1 de `prompts.md`).

### Qué me dio

Ejecuté el comando desde `lab-testing/` y escribí `docs/` desde allí, así
que creé una carpeta nueva, `lab-testing/docs/`, con
`p1-cobertura-antes.txt` y `p1-cobertura-despues.txt`. Las salidas de todo
el lab van en `06-Testing/docs/`, que es a donde enlaza el README.

### Qué corregí y por qué

Moví los dos ficheros a `06-Testing/docs/` y borré `lab-testing/docs/`. Las
salidas siguientes (`p1-sin-asserts.txt`, `p1-romper-1.txt` y
`p1-romper-2.txt`) se escribieron directamente en `../docs/`. Antes de
guardarlas también vi que Vitest 5 detecta que lo lanza un agente (por
`CLAUDECODE` y `AI_AGENT`, con `std-env`) y oculta en la tabla las filas al
100 %. Por eso todas se generaron sin esas variables: así salen igual que
en tu terminal.

**¿Los tests fallaban al romper el código?** No aplica: era dónde se guardaban las salidas.

---

**12 · El spec "sin asserts" no llegaba al 100 %**

### Prompt

"Demuestra que 100 % de cobertura no es estar bien probado: un spec temporal
que llame a todas las funciones de cart.ts SIN ningún expect […] cobertura
100 % y todo verde." (prompt P1 de `prompts.md`).

### Qué me dio

La primera versión del spec temporal llamaba a cada función una vez: sólo
con Etiopía y con un carrito de un único café. La tabla daba `% Branch 75`,
con las líneas 6 y 11 sin cubrir. No se recorrían el lado `0` del
`coffee.discount ?? 0` (Etiopía tiene descuento) ni el `: item` del `map` de
`addToCart` (no había otro café que dejar igual). Con el 💥 de `finalPrice`
las ramas subían a 83,33 %, porque el 💥 borra la rama del `??`. "Llamar a
todas las funciones" no es lo mismo que recorrer todas las ramas.

### Qué corregí y por qué

Añadí `finalPrice(colombia)` (sin descuento) y un carrito con dos cafés en
el que se suma uno que no está, y sigue sin ningún `expect`. Con esos
cambios sale 100 % en las cuatro columnas, con y sin el 💥, y el test en
verde ([docs/p1-sin-asserts.txt](docs/p1-sin-asserts.txt)). Lo que se
quería demostrar sólo se ve si la cobertura de verdad es del 100 %. Dejé la
primera versión contada en el README porque enseña otra cosa: romper el
código puede hacer que suba la cobertura.

**¿Los tests fallaban al romper el código?** Que no se pusiera en rojo era justo lo que se quería enseñar: el spec sin
`expect` sigue en verde con el 💥 de `finalPrice`. Lo que fallaba era la
demostración: la primera versión ni siquiera llegaba al 100 % de cobertura.

---

**13 · "Vitest 5 esconde la consola de los tests que pasan" (sólo en modo agente)**

### Prompt

"Revisa que no salga ningún aviso "not wrapped in act(...)" en la salida"
(prompt 5 de `prompts.md`), y en la revisión: "Que en la salida de vitest no
hay avisos (act, key, validateDOMNesting…)" (prompt 7 de `prompts.md`).

### Qué me dio

En O5 (entradas 8 y 9) escribí en el README de O4 y O5, y en esta bitácora,
que "Vitest 5 no enseña la consola de los tests que pasan" y que "con el
reporter por defecto" la salida no enseña ningún `stderr`.

### Qué corregí y por qué

Al generar `docs/vitest-final.txt` en O7 con el reporter `default` (sin
`CLAUDECODE` ni `AI_AGENT`) salieron los tres `stderr` del "outdated JSX
transform" sin pasar `--silent=false`. Lo comparé con el mismo spec lanzado
con esas variables: así no sale ninguno. En `node_modules/vitest/dist`, el
reporter por defecto es `isAgent ? "minimal" : "default"`, y
`MinimalReporter` pone `silent = "passed-only"` si no se le pasa `--silent`.
O sea: quien escondía la consola era el modo agente, no Vitest 5. En tu
terminal los avisos se ven. `docs/o4-verde.txt` y
`docs/o5-romper-2-sin-test.txt` se generaron con el `minimal` (no tienen
ninguna línea `✓`), aunque el README decía que todas las salidas se habían
hecho sin esas variables. Corregí las frases de O1, O4 y O5 del README y
dejé dicho qué dos salidas son la excepción. La conclusión de las entradas 8
y 9 se mantiene (hay que mirar la consola con `--silent=false` antes de
decir que no hay avisos); lo que estaba mal era la causa.

**¿Los tests fallaban al romper el código?** No aplica: era la explicación
de por qué no se veían los avisos, no un test.

---

**14 · Tres nombres de test que no dicen en qué caso**

### Prompt

"Que todos los nombres de test dicen qué se espera y en qué caso" (prompt 7
de `prompts.md`), sobre los tests de los prompts 2, 3 y 4. La regla está en
el enunciado ("Nombres de test que digan qué se espera y en qué caso") y en
CLAUDE.md ("debería … cuando …").

### Qué me dio

Tres tests que decían qué se espera pero no en qué caso:
`debería contar como 0 un coffeeId que no existe en el catálogo` (O2),
`debería llamar a fetch una vez con "/api/coffees" y la cabecera Accept:
application/json` (O3) y `debería mostrar el nombre del café como encabezado
de nivel 3` (O4). Los otros 45 llevan su "cuando…".

### Qué corregí y por qué

Les añadí el caso sin cambiar lo que comprueban: `debería contar como 0 un
café cuando su coffeeId no existe en el catálogo`, `… cuando se piden los
cafés` y `… cuando se pinta la tarjeta`. Actualicé las tablas del README
(O2, O3, O4 y 💥). Las salidas antiguas de `docs/` llevan el nombre de
entonces, porque son lo que salió en su momento.

**¿Los tests fallaban al romper el código?** El de O2 y el de O3 sí: ya se
habían visto fallar con sus 💥 (`o2-romper-otros.txt` y
`o3-romper-otros.txt`). El del encabezado, no: entrada 16.

---

**15 · `removeFromCart` podía mutar el carrito sin que fallara nada**

### Prompt

"Preparación para la revisión […] Para cada uno: ¿se pone algo en rojo? Si
no, añade el test que falta" y "cómo escribiría en directo los dos tests de
ejemplo del enunciado ("que removeFromCart no modifica el carrito" […])"
(prompt 7 de `prompts.md`), sobre los tests de `cart.spec.ts` (prompt 2).

### Qué me dio

En O2 escribí el test de que `addToCart` no muta el carrito, pero para
`removeFromCart` sólo uno que comprueba el resultado. Los ocho cambios del
paso 4 los detectaba algún test. Probé uno más, el del ejemplo del
enunciado: `removeFromCart` que hace `cart.splice(index, 1)` sobre el
carrito recibido y devuelve `[...cart]`. Los 47 tests siguieron en verde
([docs/revision-9-sin-test.txt](docs/revision-9-sin-test.txt)).

### Qué corregí y por qué

El resultado es correcto y es un array nuevo, así que el `toEqual` del test
de O2 pasa, y en `useCart` React ve otro array y vuelve a pintar bien. Lo
único que está mal es que el carrito recibido también cambia, y para verlo
hay que guardar una copia antes. Añadí `no debería modificar el carrito que
recibe cuando quita un café` (`cart.spec.ts:138`), igual que el de
`addToCart`: `structuredClone` en el Arrange, `toEqual(original)` y
`not.toBe(cart)`. Con el cambio se pone rojo (`expected [ { coffeeId: 1,
quantity: 1 } ] to deeply equal [ { coffeeId: 1, quantity: 1 }, …(1) ]`,
[docs/revision-9.txt](docs/revision-9.txt)) y sin él pasa. Ahora son 48
tests.

**¿Los tests fallaban al romper el código?** No: con este cambio no se ponía
rojo ningún test. Es el único de los nueve de la revisión que se escapaba.

---

**16 · Tres tests de la tarjeta que no se habían visto fallar**

### Prompt

"Escribe los tests […] 💥 Rompe el código" (prompt 4 de `prompts.md`), y en
la revisión: "Repite todos los 💥 de O2-O6" (prompt 7).

### Qué me dio

El 💥 de O4 sólo pone en rojo el test de `onAdd`, y en O4 no hice más 💥
(en O2, O3, O5 y O6 sí hice uno por cada test que quedaba en verde). Al
buscar en O7 cada uno de los 48 tests en las líneas `FAIL` de todas las
salidas de `docs/`, dos no aparecían nunca: el del encabezado de nivel 3 y
el de "sin descuento". Y un tercero, el del precio y el `-10 %`, sólo
aparecía en salidas de O7 (R1, R6 y el repaso del 💥 2 de O2). El de "sin
descuento" y el del precio también fallan en `o4-sin-cleanup.txt`, pero por
la limpieza del DOM, no por un cambio en el código. CLAUDE.md dice que cada
test de Claude se ve fallar antes de darlo por bueno.

### Qué corregí y por qué

Les hice un 💥 a cada uno, uno cada vez y deshecho con `git checkout --`
([docs/o4-romper-otros.txt](docs/o4-romper-otros.txt)): con `<h2>` en vez
de `<h3>` falla el del encabezado (`Unable to find an accessible element
with the role "heading" and name "Etiopía Yirgacheffe"`), y con la
etiqueta siempre visible falla el de "sin descuento" (`expected document
not to contain element, found <p>`: Colombia enseña `-0 %`). Los añadí a la
tabla de 💥. El del precio no necesitó uno nuevo: se pone en rojo con R1
(`toFixed(1)`), R6 (sin la etiqueta) y el 💥 2 de O2 con la suite final.
Ahora los 48 tests se han visto fallar con un cambio en el código.

**¿Los tests fallaban al romper el código?** Sí, en cuanto se rompió lo que
comprueban; el fallo era mío por no haberlo probado en O4.

---

### ¿Los tests de la IA fallaban cuando se rompía el código?

Casi siempre, pero no todos ni a la primera. Cada 💥 del enunciado lo
detectaba algún test desde el principio, pero entre todos ponían en rojo
muchos menos tests de los que había: en O2, 3 de 12; en O3, 1 de 6; en O4,
1 de 4; en O5, 4 de 9; en O6, 1 de 4 (entrada 10). Un
test que no se ha visto fallar no está demostrado, así que en cada
obligatorio hice más 💥 hasta verlos todos en rojo, y en O7 vi que en O4
me había dejado tres (entrada 16). Hubo dos casos en los que el código estaba
mal y **ningún** test lo detectaba: quitar el `.toLowerCase()` de `filter`
en O5 (el 🤔 del enunciado: con "bra" en minúsculas no se nota; lo arregló
el test de "BRA") y `removeFromCart` mutando el carrito recibido en la
revisión de O7 (entrada 15: lo arregló un test nuevo). Y una trampa del
enunciado que también me la habría colado: el try/catch del 🪤 de O3 seguía
en verde con un 200. Los ocho cambios de "Preparación para la revisión" sí
los detectaba algún test desde el principio.
