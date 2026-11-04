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

## Respuestas

### O1

**¿Qué aviso da React sin key y para qué la necesita? ¿Por qué usáis coffee.id y no el índice del map?**

Sin `key`, React escribe en la consola ``Each child in a list should have a unique "key" prop. Check the render method of `App`. See https://react.dev/link/warning-keys for more information.``: necesita la `key` para saber qué elemento de la lista es cuál entre un render y el siguiente, y así reutilizar, mover o quitar sólo el `<li>` que ha cambiado en lugar de rehacerlos todos. En `src/app.tsx` usamos `key={coffee.id}` porque el `id` va con el café y no cambia nunca, mientras que el índice depende de la posición: en cuanto el buscador de O2 filtre la lista o se añada o borre un café, el índice 0 pasaría a ser otro café y React reutilizaría el elemento (y su estado) equivocado.

### O2

**¿Por qué escribís onAdd={addToCart} y no onAdd={addToCart()}?**

Con `onAdd={addToCart}` le pasamos a `CoffeeCard` la función misma, para que sea la tarjeta quien la llame cuando se pulse su botón (`onClick={() => onAdd(coffee)}` en `src/coffee-card.tsx`). Con `onAdd={addToCart()}` la estaríamos ejecutando durante el render de `App` y pasando su resultado (`void`, en ejecución `undefined`), así que TypeScript ya protesta (falta el argumento `coffee` y `void` no es asignable a `(coffee: Coffee) => void`); y si compilara, cada render llamaría a `setCart`, que provoca otro render, en bucle infinito ("Too many re-renders").

**¿Por qué el total del carrito no necesita su propio useState? ¿Qué problema podríais tener si lo fuera?**

Porque se deduce entero de `cart`: en `src/app.tsx` se calcula en cada render con `cart.reduce((sum, coffee) => sum + coffee.price, 0)`, y como cada `setCart` provoca un render, el total siempre corresponde al carrito que se está pintando. Si fuera un estado aparte habría dos fuentes de verdad que mantener sincronizadas a mano: por ejemplo, con `const [total, setTotal] = useState(0)` y un `useEffect(() => setTotal(...), [cart])`, al añadir el Kenia AA el primer render pinta "1 bolsa · 0.00 €" (cart ya cambió, total todavía no) y sólo después el efecto fuerza un segundo render con "15.50 €"; y si en `emptyCart` alguien hace `setCart([])` pero olvida `setTotal(0)`, se queda "0 bolsas · 15.50 €".
