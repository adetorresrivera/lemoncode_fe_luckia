# Bitácora de IA · Lab 06

Herramienta: Claude Code en VS Code (dentro del DevContainer), con los prompts
de [prompts.md](prompts.md).

## 1 · `createRoot` no pide un `Element`

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

## 2 · "El lock no va a cambiar"

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
aquí, el commit `L6 - Preparacion` lleva el lock reescrito, y cualquier
cambio posterior se verá con `git diff package-lock.json`.

## 3 · El `tsconfig.json` reformateado de rebote

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

## 4 · "14.9 * 0.9 da 13.410000000000002"

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

## 5 · Dos llamadas a `getCoffees` para dos `rejects`

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

## 6 · La prueba de `Response` sin la config de test

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

## 7 · El spec de la tarjeta sin `import React`

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

## 8 · "No sale ningún aviso de act" (sí salía)

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

## 9 · "Sin avisos en consola" en O4, mirado donde no se veían

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

## 10 · "React lanza `Invalid hook call`" (y el 💥 que deja tres tests en verde)

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

## 11 · Las salidas de P1 en la carpeta equivocada

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

## 12 · El spec "sin asserts" no llegaba al 100 %

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
