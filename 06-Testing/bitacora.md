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
