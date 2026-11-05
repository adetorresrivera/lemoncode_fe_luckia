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
