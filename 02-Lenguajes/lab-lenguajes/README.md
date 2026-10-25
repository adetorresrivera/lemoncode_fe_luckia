# Lab 02 · Lenguajes (katas de JavaScript y TypeScript)

Katas cortas e independientes sobre el catálogo de cafés de _Tueste_: tipos,
funciones, destructuring, `?.` y `??`, métodos de arrays, inmutabilidad,
uniones, genéricos, tipos de utilidad, closures e Immer.

Hay un fichero por kata en [`src/`](src/) y [`src/main.ts`](src/main.ts) los
importa todos para que se ejecuten. Debajo de cada `console.log` hay un
comentario con la salida esperada (`// → "14.90 €"`).

| Ficheros | Qué contiene |
|---|---|
| [`src/types.ts`](src/types.ts), [`src/data.ts`](src/data.ts) | Tipos del catálogo (O1) y datos de partida |
| `src/o01-*.ts` … `src/o11-*.ts` | Obligatorios O1-O11 |
| `src/p02-*.ts`, `src/p04-*.ts`, `src/p05-*.ts`, `src/p07-*.ts` | Opcionales |
| [`src/tfm-types.ts`](src/tfm-types.ts), [`src/tfm-data.ts`](src/tfm-data.ts) | Modelo de datos de Postula (P7) |
| `src/d02-*.ts`, `src/d04-*.ts` | Desafíos |
| `src/*.test.ts` | Tests con Vitest (P1) |

## Captura de la consola

<!-- TODO: hacer la captura y guardarla en docs/screenshots/consola.png.
     npm run dev → http://localhost:5173 → F12 → Console. -->

![Consola de DevTools con la salida de todas las katas](docs/screenshots/consola.png)

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
   ahí sale todo lo que hacen las katas con `console.log`. La página está en
   blanco; todo pasa en la consola.

Otros comandos, desde `02-Lenguajes/lab-lenguajes`:

| Comando | Qué hace |
|---|---|
| `npm run katas` | Ejecuta `src/main.ts` con `tsx` y muestra la salida en la terminal, sin navegador |
| `npm test` | Ejecuta con Vitest los tests de O5, O6 y P2 (`src/*.test.ts`). Los `console.log` de las katas solo se ven si algún test falla |
| `npx tsc` | Comprueba los tipos. Vite no lo hace: quita los tipos y ejecuta aunque haya errores. Si no muestra nada, no hay errores |

El código vive en el volumen del contenedor y no en la carpeta de Windows; está
explicado en el [README del lab 1](../../01-Maquetacion/postula/README.md#dónde-está-el-código).

### En local (Node 22.12+)
```bash
cd 02-Lenguajes/lab-lenguajes
npm install
npm run dev      # o npm run katas para verlo en la terminal
npx tsc
```

## Comprobación de tipos

`npx tsc` sale **sin errores** (no muestra nada y termina con código 0).
Comprobado el 25/10/2026 dentro del DevContainer, con TypeScript 6 y el
`tsconfig.json` estricto de la plantilla (`strict`, `noUnusedLocals`,
`noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`).

`npm test` también pasa: 3 ficheros y 26 tests.

Los errores que piden las katas (O1 y los 🔍) están **comentados** en el código
con el mensaje de `tsc`, así que no rompen la compilación. Para verlos, se
descomenta el bloque y se vuelve a ejecutar `npx tsc`.

## Respuestas a las preguntas 📝 y 🔍

Cada respuesta está en un comentario del código, junto a la kata.

| Kata | Pregunta | Respuesta corta | Dónde |
|---|---|---|---|
| O2 🔍 | ¿Qué pasa al quitar un `case` del `switch`? | `TS2366: Function lacks ending return statement…`: con un tueste sin cubrir, la función llegaría al final sin `return` y devolvería `undefined`, que no cabe en `string`. Con los tres `case`, `roast` es `never` tras el `switch` y el final es inalcanzable | [`o02-funciones.ts:28`](src/o02-funciones.ts#L28-L34) |
| O3 📝 | ¿Qué es el `...` de `sumAll(...coffees.map(…))`? | Spread, no rest: está en una llamada y despliega el array en argumentos sueltos. El rest de la firma de `sumAll` los vuelve a juntar | [`o03-destructuring.ts:41`](src/o03-destructuring.ts#L41-L45) |
| O5 🔍 | ¿Qué pasa al cambiar `toSorted` por `sort`? | Con el `filter` delante, nada: `sort` reordena el array intermedio que crea `filter`, no `coffees`. Si se quita el `filter` o se mueve detrás, `sort` reordena el `coffees` de `data.ts` y la última línea sale en otro orden | [`o05-arrays.ts:45`](src/o05-arrays.ts#L45-L55) |
| O8 🔍 | Error al borrar `delivered` de `statusLabel` | `TS2741: Property 'delivered' is missing in type … but required in type 'Record<OrderStatus, string>'` | [`o08-uniones-genericos.ts:15`](src/o08-uniones-genericos.ts#L15-L18) |
| O8 🔍 | ¿Qué devuelven `findById(coffees, 4)` y `findById(customers, 3)`? | `Coffee \| null` y `Customer \| null`: TypeScript infiere `T` a partir de la lista | [`o08-uniones-genericos.ts:33`](src/o08-uniones-genericos.ts#L33-L35) |
| O10 📝 | ¿Por qué `.map(blackFriday)` va sin paréntesis? | Porque a `map` se le pasa la función, no su resultado; `map` la llama con cada elemento | [`o10-closures.ts:41`](src/o10-closures.ts#L41-L47) |
| O10 📝 | ¿`blackFriday` es pura? | Sí: solo usa `price` y `rate`, que está capturado pero nunca cambia | [`o10-closures.ts:49`](src/o10-closures.ts#L49-L52) |
| O10 📝 | ¿Y `nextOrderId`? | No: sin argumentos devuelve cada vez un id distinto y modifica `count`, que vive en el closure | [`o10-closures.ts:54`](src/o10-closures.ts#L54-L57) |
| O11 📝 | ¿Spread o Immer? | Spread para cambios planos o de un nivel; Immer cuando hay que bajar dos o más niveles, hacer varios cambios a la vez o tocar arrays dentro de objetos | [`o11-immer.ts:66`](src/o11-immer.ts#L66-L76) |

Además de las que pide el enunciado, hay otros comentarios marcados igual:

- **O4 📝**: por qué con `||` el café con `discount: 0` también da 15.50 € ([`o04-opcionales.ts:36`](src/o04-opcionales.ts#L36-L38)) y por qué `wantsNewsletter` con `||` da `true` para Lucía ([`o04-opcionales.ts:49`](src/o04-opcionales.ts#L49-L53)).
- **O9 🔍**: error al intentar cambiar el `id` con `updateCoffee` ([`o09-utilidad.ts:29`](src/o09-utilidad.ts#L29-L31)).
- **D2 🔍**: error de `assertNever` al añadir `paypal` sin su `case` ([`d02-pagos.ts:31`](src/d02-pagos.ts#L31-L33)).

## Checklist

### ✅ Obligatorios

- [x] **O1 · Tipar el catálogo**: `Roast`, `Coffee`, `Address` y `Customer` en [`src/types.ts`](src/types.ts), y los tres errores provocados, comentados con su mensaje, en [`src/o01-tipos.ts`](src/o01-tipos.ts).
- [x] **O2 · Funciones básicas**: `formatPrice`, `stockStatus` (`if`/`else`), `roastLabel` (`switch`) y el `for...of` en [`src/o02-funciones.ts`](src/o02-funciones.ts).
- [x] **O3 · Destructuring y rest**: `coffeeCard`, `mainNote`, `toPublicCoffee` y `sumAll` en [`src/o03-destructuring.ts`](src/o03-destructuring.ts).
- [x] **O4 · Datos que pueden faltar**: `?.` y `??` sin ningún `if`, y la trampa del `||`, en [`src/o04-opcionales.ts`](src/o04-opcionales.ts).
- [x] **O5 · Métodos de arrays**: sin bucles, con `filter` → `toSorted` → `map`, `reduce`, `some`, `every` y `find`, en [`src/o05-arrays.ts`](src/o05-arrays.ts).
- [x] **O6 · El carrito inmutable**: `addToCart`, `removeFromCart`, `changeQuantity` y `cartTotal` en [`src/o06-carrito.ts`](src/o06-carrito.ts). Los elementos que no cambian se comparten (`cart3[1] === cart2[1]`).
- [x] **O7 · ¿Pura o impura?**: cada función con su veredicto y la condición que rompe, y versiones puras de las impuras, en [`src/o07-pureza.ts`](src/o07-pureza.ts).
- [x] **O8 · Uniones, `Record` y genéricos**: `OrderStatus`, `statusLabel`, `normalizeId` y `findById` en [`src/o08-uniones-genericos.ts`](src/o08-uniones-genericos.ts).
- [x] **O9 · Tipos de utilidad**: `CoffeePreview` (`Pick`), `NewCoffee` (`Omit`), `updateCoffee` (`Partial`) y `countByRoast` (`Record`) en [`src/o09-utilidad.ts`](src/o09-utilidad.ts).
- [x] **O10 · Closures**: `createDiscount` y `createOrderIdGenerator` en [`src/o10-closures.ts`](src/o10-closures.ts).
- [x] **O11 · Immer**: el mismo cambio con spread y con `produce`, y un `produce` con varios cambios, en [`src/o11-immer.ts`](src/o11-immer.ts).
- [ ] **O12 · README + bitácora de IA**: este fichero y la [bitácora](#bitácora-de-ia). Falta la captura de la consola.

### ⭐ Opcionales

- [x] **P1 · Tests con Vitest**: [`src/o05-arrays.test.ts`](src/o05-arrays.test.ts) y [`src/o06-carrito.test.ts`](src/o06-carrito.test.ts) (y los de P2).
- [x] **P2 · Deshacer en el carrito**: `createCartHistory` con un closure en [`src/p02-historial.ts`](src/p02-historial.ts), con sus tests en [`src/p02-historial.test.ts`](src/p02-historial.test.ts).
- [ ] **P3 · Agrupar con `reduce`**
- [x] **P4 · Ordenar por cualquier propiedad**: `sortBy` genérico en [`src/p04-sortby.ts`](src/p04-sortby.ts). Solo acepta claves cuyo valor sea texto o número, así que `sortBy(coffees, "color")` (y también `"notes"`) da error.
- [x] **P5 · Datos desconocidos con `unknown`**: `isCoffee` con guardas de tipo y sin `as` en [`src/p05-unknown.ts`](src/p05-unknown.ts).
- [ ] **P6 · Vuestros propios `map` y `filter`**
- [x] **P7 · Modelad los datos de vuestro TFM**: entidades de Postula en [`src/tfm-types.ts`](src/tfm-types.ts) y tres funciones puras en [`src/p07-tfm.ts`](src/p07-tfm.ts).

### 🔥 Desafíos

- [ ] **D1 · Pintad el catálogo en la landing del módulo 1**
- [x] **D2 · Uniones discriminadas**: `describePayment` con `assertNever` en [`src/d02-pagos.ts`](src/d02-pagos.ts).
- [ ] **D3 · Medid el coste de la inmutabilidad**
- [x] **D4 · Un pedido como en React**: `cartReducer` con `produce` y `actions.reduce(cartReducer, [])` en [`src/d04-reducer.ts`](src/d04-reducer.ts).
- [ ] **D5 · Vuestro propio `reduce`**

## Bitácora de IA

Herramienta: **Claude Code** (extensión de VS Code), dentro del DevContainer, con las reglas del lab en `CLAUDE.md`: nada de `any`, `var`, `enum` ni `as` para callar errores, no mutar la entrada, `toSorted` en vez de `sort`, `import type` y la salida esperada debajo de cada `console.log`.

La bitácora completa, con el prompt, lo que me dio y lo que corregí en cada kata, está en [`../bitacora.md`](../bitacora.md):

- **O7 · Pureza**: para `createOrderId` recomendaba pasar el timestamp como parámetro; elegí inyectar el reloj (`now: () => number`), que es pura solo si `now` lo es.
- **P4 · `sortBy`**: la firma del enunciado (`K extends keyof T`) deja pasar `notes` y no deja comparar sin `as`; elegí restringir `K` a las claves con valor `string | number`.
- **P7 · `nextSteps`**: descartaba las acciones vencidas; ahora salen primero, marcadas con `overdue`.
