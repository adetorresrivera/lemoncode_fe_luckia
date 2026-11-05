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

## O2 · El carrito

Fichero `lab-testing/src/catalog/cart.spec.ts`: 12 tests, con un `describe`
por función. Los cafés salen de `test-data.ts` (Etiopía 14.9 con `discount:
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
| cartTotal | debería devolver 0 cuando el carrito está vacío | `toBe` |
| cartTotal | debería sumar los precios finales por cantidad cuando hay 2 × Etiopía y 1 × Brasil (37.32) | `toBeCloseTo(37.32, 2)` |
| cartTotal | debería contar como 0 un coffeeId que no existe en el catálogo | `toBe` |

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
| cuando la API responde 200 | debería llamar a fetch una vez con "/api/coffees" y la cabecera Accept: application/json | el mismo | `toHaveBeenCalledTimes(1)` y `toHaveBeenCalledWith('/api/coffees', expect.objectContaining({ headers: { Accept: 'application/json' } }))` |
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
| debería mostrar el nombre del café como encabezado de nivel 3 | Etiopía | `getByRole('heading', { level: 3, name: 'Etiopía Yirgacheffe' })` | `toBeInTheDocument()` |
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
  ([docs/o4-consola.txt](docs/o4-consola.txt), con `--silent=false`: Vitest 5
  no enseña la consola de los tests que pasan, y por eso
  [docs/o4-verde.txt](docs/o4-verde.txt) no sirve para esto). El único
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
  type-check` limpio. Esta salida no enseña la consola (Vitest 5 la esconde
  en los tests que pasan), así que no prueba que no haya avisos.
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
- El 💥 del enunciado, en la tabla de abajo.

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
- **Vitest 5 esconde la consola de los tests que pasan.** Con el reporter
  por defecto, la salida de `npx vitest run` no enseña ningún `stderr` si el
  test pasa, así que buscar "not wrapped in act" en esa salida no demuestra
  nada (así me equivoqué la primera vez: bitácora, entrada 8). Para ver los
  avisos hay que ejecutar con `--silent=false`. Así están hechos
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

## Romper el código (💥)

Cada 💥 es un único cambio en `src/catalog`, con `git diff --exit-code` limpio
antes. La salida es la de `NO_COLOR=1 npx vitest run -c
./config/test/config.ts`. Después se deshace con `git checkout --` y se
comprueba que el diff vuelve a estar limpio y los tests en verde.

| Obligatorio | Qué se cambió | Test(s) en rojo | Salida |
| --- | --- | --- | --- |
| O2 | `cart.ts`, `addToCart`: `{ ...item, quantity: item.quantity + 1 }` → `((item.quantity += 1), item)` | `addToCart > no debería modificar el carrito que recibe cuando el café ya está en él` (falla el `toEqual`: `quantity` 3 en vez de 2) | [docs/o2-romper-1.txt](docs/o2-romper-1.txt) |
| O2 | `cart.ts`, `finalPrice`: `coffee.price * (1 - (coffee.discount ?? 0))` → `coffee.price` | `finalPrice > debería aplicar el descuento cuando el café tiene discount (Etiopía → 13.41)` (14.9) y `cartTotal > debería sumar los precios finales por cantidad cuando hay 2 × Etiopía y 1 × Brasil (37.32)` (40.3) | [docs/o2-romper-2.txt](docs/o2-romper-2.txt) |
| O3 | `coffee.api.ts`, `case 503:` → `case 502:` | `getCoffees > cuando la API responde con un error > debería rechazar con "Servicio no disponible" cuando la API responde 503` (`expected [Function] to throw error including 'Servicio no disponible' but got 'Error inesperado'`: el 503 cae en el `default`) | [docs/o3-romper-1.txt](docs/o3-romper-1.txt) |
| O4 | `coffee-card.tsx`, botón: `onAdd(coffee)` → `onAdd({ ...coffee, price: 0 })` | `CoffeeCard > debería llamar a onAdd una vez y con ese café cuando se pulsa el botón de añadir` (falla el `toHaveBeenCalledWith(colombia)`: el diff marca `- "price": 12.9,` / `+ "price": 0,`; `toHaveBeenCalledTimes(1)` sigue pasando) | [docs/o4-romper-1.txt](docs/o4-romper-1.txt) |
| O5 | `coffee-catalog.tsx`, `c.name.toLowerCase().includes(…)` → `c.name.includes(…)` | `CoffeeCatalog > buscador > debería mostrar sólo Brasil Cerrado cuando se escribe "bra" en Buscar` y `CoffeeCatalog > buscador > debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas` (`Unable to find an accessible element with the role "listitem"`: `"Brasil Cerrado".includes("bra")` es `false` y se pinta "Sin resultados") | [docs/o5-romper-1.txt](docs/o5-romper-1.txt) |
| O5 🤔 | `coffee-catalog.tsx`, `includes(filter.toLowerCase())` → `includes(filter)`, **con el test de "BRA" saltado** (`it.skip`, temporal) | **Ninguno**: `Tests  30 passed \| 1 skipped (31)` | [docs/o5-romper-2-sin-test.txt](docs/o5-romper-2-sin-test.txt) |
| O5 🤔 | el mismo cambio, con el test de "BRA" activo | `CoffeeCatalog > buscador > debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas` (`Unable to find an accessible element with the role "listitem"`: `"brasil cerrado".includes("BRA")` es `false`) | [docs/o5-romper-2.txt](docs/o5-romper-2.txt) |
| O5 | `coffee-catalog.tsx`, botón: se quita `disabled={units === 0}` | `CoffeeCatalog > carrito (integración) > debería tener "Vaciar carrito" desactivado cuando el carrito está vacío` (`expect(element).toBeDisabled()` / `Received element is not disabled`) | [docs/o5-romper-3.txt](docs/o5-romper-3.txt) |

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
            ├── cart.spec.ts       ← O2: 12 tests de las funciones del carrito
            ├── coffee.api.ts      ← getCoffees: fetch a /api/coffees y un error por cada estado
            ├── coffee.api.spec.ts ← O3: 6 tests de getCoffees con fetch espiado
            ├── coffee-card.tsx    ← CoffeeCard: nombre, origen, precio, descuento y botón Añadir
            ├── coffee-card.spec.tsx ← O4: 4 tests de la tarjeta con render, screen y userEvent
            ├── use-cart.ts        ← useCart: estado del carrito, units, total, add, remove y clear
            ├── coffee-catalog.tsx ← CoffeeCatalog: carga, error, buscador y carrito (no se monta en index.tsx)
            ├── coffee-catalog.spec.tsx ← O5: 9 tests del catálogo con getCoffees espiado (carga, error, buscador y carrito)
            └── test-data.ts       ← los tres cafés de prueba que usan todos los tests
```

## Checklist

### Obligatorios
- [x] O1 · Configurar Vitest
- [x] O2 · Funciones puras: el carrito
- [x] O3 · Código asíncrono: la llamada a la API
- [x] O4 · Un componente presentacional: la tarjeta
- [x] O5 · Un componente con datos: el catálogo
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

### O2

**¿Por qué las funciones puras (laboratorio 2) son las más fáciles de probar? ¿Qué habéis tenido que preparar en el Arrange?**

Una función pura sólo depende de sus argumentos y sólo produce su valor de
retorno. No lee nada de fuera (ni red, ni reloj, ni DOM, ni estado global) y
no cambia nada de fuera (ni siquiera lo que recibe). Por eso el test es
siempre el mismo: unos datos, una llamada y un `expect` sobre lo que
devuelve. No hace falta jsdom, ni `render`, ni `await`, ni mockear nada, y
el resultado no depende del orden de los tests ni de la máquina. Los 12
tests de `cart.spec.ts` tardan entre 0 y 2 ms cada uno
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
