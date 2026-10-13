# 🧪 Laboratorio · Módulo 02 · JavaScript y TypeScript

> ⏱️ Dedicación estimada: **6-10 h** para los obligatorios; los opcionales y desafíos, lo que queráis estirar. 📦 Formato: enlace a un **repositorio de GitHub**

## La idea

En el módulo hemos repasado el lenguaje **por dentro**: tipos, funciones, destructuring, rest y spread, `?.` y `??`; después **TypeScript** (anotaciones, interfaces, alias, uniones, genéricos y tipos de utilidad) y, por último, **inmutabilidad**: `const` frente a mutar, funciones puras, closures, métodos de arrays e Immer.

En este laboratorio vais a practicarlo con **katas**: ejercicios cortos e independientes, cada uno centrado en un tema. Todos usan los mismos datos de partida: el catálogo de _Tueste_, el tostadero de café del laboratorio anterior ☕.

Cada kata trae **la salida esperada**. Vuestro trabajo es escribir las funciones, sacar el resultado con `console.log` y comprobar que coincide.

La regla del juego (la misma que en el módulo 1):

- ✅ **La IA está permitida y recomendada**.
- ⚠️ Pero **tenéis que entender cada línea que entregáis**. Si en la revisión os preguntamos "¿por qué aquí `??` y no `||`?" o "¿este `map` muta el carrito?", tenéis que saber responder.

## Punto de partida: el proyecto

Usamos otra vez **Vite**, ahora con la plantilla de **TypeScript**:

```bash
npm create vite@latest lab-lenguajes -- --template vanilla-ts
cd lab-lenguajes
npm install
npm install immer
```

Limpiad la plantilla: borrad `src/counter.ts` y dejad `src/main.ts` vacío. Arrancad con:

```bash
npm run dev
```

Abrid la página en el navegador y la **consola de DevTools** (`F12` → _Console_). Todo lo que hagáis con `console.log` saldrá ahí.

> 💡 **¿Preferís ver la salida en la terminal?** También vale: `npx tsx src/main.ts` ejecuta el fichero directamente con Node, sin navegador.

### ⚠️ Vite no comprueba los tipos

Esto es importante: Vite **quita los tipos y ejecuta**, aunque haya errores de TypeScript. Los errores los veis en el editor (VS Code los subraya en rojo) o ejecutando:

```bash
npx tsc
```

Si no muestra nada, no hay errores. **Antes de entregar, `npx tsc` tiene que salir limpio.**

### Lo que trae el `tsconfig.json` de la plantilla

La plantilla viene con **TypeScript 6** y una configuración estricta. Conviene saber qué hace cada opción, porque os vais a cruzar con ellas:

|Opción|Qué significa para vosotros|
|---|---|
|`strict` (activo por defecto en TS 6)|`null` y `undefined` hay que contemplarlos (tema 10).|
|`noUnusedLocals` / `noUnusedParameters`|Una variable o un parámetro sin usar es un error.|
|`verbatimModuleSyntax`|Los tipos se importan con `import type { Coffee } from "./types";`|
|`erasableSyntaxOnly`|**No se pueden usar `enum`**: usad uniones de literales (tema 13), que es lo que se recomienda hoy.|
|`lib: ["ES2023", ...]`|Podéis usar `toSorted`, `toReversed`, `with` y `toSpliced` sin problema.|

### Estructura recomendada

Un fichero por kata, y `main.ts` que los importa todos para que se ejecuten:

```
src/
├── types.ts           ← O1 (lo escribís vosotros)
├── data.ts            ← os lo damos hecho (abajo)
├── o02-funciones.ts
├── o03-destructuring.ts
├── ...
└── main.ts
```

_./src/main.ts_

```ts
import "./o02-funciones";
import "./o03-destructuring";
// ...una línea por kata
```

Si una kata necesita una función de otra (por ejemplo `formatPrice`), exportadla con `export` e importadla donde haga falta (tema 26, módulos).

### Los datos de partida

Copiad tal cual este fichero. Al principio **no va a compilar**: le faltan los tipos, y eso es justo la primera kata.

_./src/data.ts_

```ts
import type { Coffee, Customer } from "./types";

export const coffees: Coffee[] = [
  {
    id: 1,
    name: "Etiopía Yirgacheffe",
    origin: "Etiopía",
    notes: ["floral", "bergamota", "té negro"],
    roast: "light",
    price: 14.9,
    stock: 12,
    discount: 0.1,
  },
  {
    id: 2,
    name: "Colombia Huila",
    origin: "Colombia",
    notes: ["caramelo", "manzana roja"],
    roast: "medium",
    price: 12.9,
    stock: 3,
  },
  {
    id: 3,
    name: "Kenia AA",
    origin: "Kenia",
    notes: ["frutos rojos", "pomelo"],
    roast: "light",
    price: 15.5,
    stock: 0,
    discount: 0,
  },
  {
    id: 4,
    name: "Brasil Cerrado",
    origin: "Brasil",
    notes: ["chocolate", "avellana"],
    roast: "dark",
    price: 10.5,
    stock: 25,
  },
  {
    id: 5,
    name: "Guatemala Antigua",
    origin: "Guatemala",
    notes: ["cacao", "especias"],
    roast: "medium",
    price: 13.2,
    stock: 8,
    discount: 0.15,
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    notes: ["tierra", "cedro", "chocolate negro"],
    roast: "dark",
    price: 13.9,
    stock: 0,
  },
];

export const customers: Customer[] = [
  {
    id: 1,
    name: "Lucía",
    email: "lucia@mail.com",
    address: { street: "Calle Larios 5", city: "Málaga", zip: "29005" },
    preferences: { grind: "molido", newsletter: false },
  },
  {
    id: 2,
    name: "Marcos",
    email: "marcos@mail.com",
    preferences: {},
  },
  {
    id: 3,
    name: "Ana",
    email: "ana@mail.com",
    address: { street: "Gran Vía 12", city: "Madrid", zip: "28013" },
  },
];
```

### Reglas para todas las katas

- ❌ Nada de `any` ni de `var`.
- ❌ **No mutéis los datos de entrada** (salvo que la kata diga lo contrario): nada de `push`, `sort`, `splice` ni `objeto.prop = …` sobre lo que recibe una función. Devolved valores nuevos.
- ✅ Anotad los **parámetros** y el **tipo de retorno** de cada función. Dentro, dejad que TypeScript infiera.
- ✅ Debajo de cada `console.log`, un comentario con lo que esperáis: `// → "14.90 €"`.
- ✅ `npx tsc` sin errores.

> 💡 Las salidas esperadas están escritas como las muestra Node. En la consola del navegador los objetos y arrays salen plegables, pero el contenido tiene que ser el mismo.

---

## ✅ Parte 1 · Obligatorios

Todos son necesarios para aprobar. Son cortos: si os atascáis en uno, volved al apartado del módulo que se indica.

### O1 · Tipar el catálogo (temas 10, 11, 12 y 13)

Cread `src/types.ts` con los tipos que necesita `data.ts`, **exportados**:

**`Roast`**: un alias con una unión de literales: sólo puede ser `"light"`, `"medium"` o `"dark"`.

**`Coffee`**: una interfaz con:

|Propiedad|Tipo|Notas|
|---|---|---|
|`id`|número|**de sólo lectura**|
|`name`|texto||
|`origin`|texto||
|`notes`|array de textos|notas de cata|
|`roast`|`Roast`||
|`price`|número|en euros|
|`stock`|número|bolsas disponibles|
|`discount`|número|**opcional**. `0.1` significa un 10 %|

**`Customer`**: una interfaz con `id`, `name` y `email`, más:

- `address`: **opcional**, un objeto con `street`, `city` y `zip` (los tres texto). Podéis sacarlo a su propia interfaz `Address`.
- `preferences`: **opcional**, un objeto con dos propiedades también opcionales: `grind` (sólo `"grano"` o `"molido"`) y `newsletter` (booleano).

Cuando estén bien, `data.ts` compilará sin errores.

Después, **provocad tres errores a propósito** en un fichero `o01-tipos.ts` y dejadlos comentados con el mensaje que da TypeScript:

1. Un café con `roast: "extra"`.
2. Un café sin `price`.
3. Cambiar el `id` de `coffees[0]`.

Mensajes esperados (más o menos):

```
Type '"extra"' is not assignable to type 'Roast'.
Property 'price' is missing in type '{ ... }' but required in type 'Coffee'.
Cannot assign to 'id' because it is a read-only property.
```

### O2 · Funciones básicas (temas 00 y 01)

Fichero `o02-funciones.ts`. Escribid y exportad:

- `formatPrice(price: number, currency = "€"): string` → el precio con **dos decimales** y la moneda. Pista: `toFixed` y _template literals_.
- `stockStatus(stock: number): string` con `if`/`else`: `"Agotado"` si es 0, `"Últimas unidades"` si es menor que 5, y `"Disponible"` en el resto.
- `roastLabel(roast: Roast): string` con un `switch`: `"Tueste claro"`, `"Tueste medio"` y `"Tueste oscuro"`.

Y recorred el catálogo con un `for...of` para mostrar una línea por café.

```ts
console.log(formatPrice(14.9));      // → "14.90 €"
console.log(formatPrice(14.9, "$")); // → "14.90 $"
console.log(formatPrice(10));        // → "10.00 €"

// for...of sobre coffees →
// Etiopía Yirgacheffe · Tueste claro · Disponible
// Colombia Huila · Tueste medio · Últimas unidades
// Kenia AA · Tueste claro · Agotado
// Brasil Cerrado · Tueste oscuro · Disponible
// Guatemala Antigua · Tueste medio · Disponible
// Sumatra Mandheling · Tueste oscuro · Agotado
```

> 🔍 **Probad esto:** quitad un `case` del `switch`. TypeScript se queja: _"Function lacks ending return statement…"_. Se ha dado cuenta de que, con un tueste, la función no devolvería nada. Dejad un comentario explicándolo y volved a ponerlo.

### O3 · Destructuring y rest (temas 02 y 03)

Fichero `o03-destructuring.ts`:

- `coffeeCard(coffee: Coffee): string` → `"Nombre (Origen) · precio"`. **Desestructurad en el parámetro** y reutilizad `formatPrice`.
- `mainNote(coffee: Coffee): string` → la primera nota y cuántas quedan. Usad **destructuring de array con rest**: `const [first, ...others] = …`.
- `toPublicCoffee(coffee: Coffee): Omit<Coffee, "stock">` → el café **sin** el `stock` (es información interna). Usad **rest en el destructuring del parámetro**.
- `sumAll(...amounts: number[]): number` → suma todos los números que reciba.

```ts
console.log(coffeeCard(coffees[0])); // → "Etiopía Yirgacheffe (Etiopía) · 14.90 €"
console.log(mainNote(coffees[0]));   // → "floral y 2 más"
console.log(mainNote(coffees[1]));   // → "caramelo y 1 más"

console.log(toPublicCoffee(coffees[1]));
// → { id: 2, name: "Colombia Huila", origin: "Colombia",
//     notes: ["caramelo", "manzana roja"], roast: "medium", price: 12.9 }
console.log(coffees[1].stock); // → 3. El original sigue teniendo stock

console.log(sumAll(1, 2, 3)); // → 6
console.log(sumAll());        // → 0
console.log(sumAll(...coffees.map((coffee) => coffee.stock))); // → 48
```

> 📝 En la última línea hay un `...` que **no** es rest. Dejad un comentario diciendo qué es y por qué (tema 03, "Rest y spread").

### O4 · Datos que pueden faltar (tema 04)

Fichero `o04-opcionales.ts`. Aquí trabajáis con `customers`, que tienen datos incompletos:

- `getCity(customer: Customer): string` → la ciudad, o `"Sin dirección"`.
- `getGrind(customer: Customer): "grano" | "molido"` → su preferencia, o `"grano"` por defecto.
- `wantsNewsletter(customer: Customer): boolean` → su preferencia, o `true` por defecto.
- `finalPrice(coffee: Coffee): number` → el precio aplicando el descuento si lo tiene.

Usad `?.` y `??`, sin ningún `if`.

```ts
for (const customer of customers) {
  console.log(
    `${customer.name} · ${getCity(customer)} · ${getGrind(customer)} · newsletter: ${wantsNewsletter(customer)}`,
  );
}
// → Lucía · Málaga · molido · newsletter: false
// → Marcos · Sin dirección · grano · newsletter: true
// → Ana · Madrid · grano · newsletter: true

console.log(formatPrice(finalPrice(coffees[0]))); // → "13.41 €" (10 % de descuento)
console.log(formatPrice(finalPrice(coffees[1]))); // → "12.90 €" (sin descuento)
console.log(formatPrice(finalPrice(coffees[2]))); // → "15.50 €" (descuento 0)
console.log(formatPrice(finalPrice(coffees[4]))); // → "11.22 €" (15 %)
```

> 🪤 **La trampa:** escribid una segunda versión de `wantsNewsletter` con `||` en lugar de `??` y probadla con Lucía. Explicad en un comentario por qué da `true` cuando ella ha dicho que **no** quiere la newsletter.

### O5 · Métodos de arrays (tema 25)

Fichero `o05-arrays.ts`. **Ni un solo bucle**: usad `filter`, `map`, `toSorted`, `reduce`, `some`, `every` y `find`.

- `availableCoffees(list: Coffee[]): Coffee[]` → los que tienen stock.
- `catalogLabels(list: Coffee[]): string[]` → los disponibles, **ordenados por precio de menor a mayor** y convertidos con `coffeeCard`. En una sola cadena: `filter` → `toSorted` → `map`.
- `stockValue(list: Coffee[]): number` → cuánto vale todo el almacén (`precio × stock` de cada café, sumado).

```ts
console.log(availableCoffees(coffees).map((coffee) => coffee.name));
// → ["Etiopía Yirgacheffe", "Colombia Huila", "Brasil Cerrado", "Guatemala Antigua"]

console.log(catalogLabels(coffees));
// → ["Brasil Cerrado (Brasil) · 10.50 €",
//    "Colombia Huila (Colombia) · 12.90 €",
//    "Guatemala Antigua (Guatemala) · 13.20 €",
//    "Etiopía Yirgacheffe (Etiopía) · 14.90 €"]

console.log(formatPrice(stockValue(coffees))); // → "585.60 €"

console.log(coffees.some(/* ¿alguno agotado? */));          // → true
console.log(coffees.every(/* ¿todos tienen notas? */));     // → true
console.log(/* nombre del café con id 4, o "No existe" */);  // → "Brasil Cerrado"
console.log(/* nombre del café con id 99, o "No existe" */); // → "No existe"

// Y la comprobación final: el catálogo sigue en su orden original
console.log(coffees.map((coffee) => coffee.name));
// → ["Etiopía Yirgacheffe", "Colombia Huila", "Kenia AA",
//    "Brasil Cerrado", "Guatemala Antigua", "Sumatra Mandheling"]
```

> 🔍 **Probad esto:** cambiad `toSorted` por `sort` y mirad la última línea. Dejad un comentario con lo que ha pasado y volved a `toSorted`.

### O6 · El carrito inmutable (temas 20, 21 y 25) ⭐

Esta es la kata más importante: es exactamente cómo se gestiona el estado en React. Fichero `o06-carrito.ts`:

```ts
interface CartItem {
  coffeeId: number;
  quantity: number;
}

type Cart = CartItem[];
```

Escribid estas funciones. **Todas devuelven un carrito nuevo y no tocan el que reciben**:

- `addToCart(cart: Cart, coffeeId: number): Cart` → si el café ya está, suma 1 a su cantidad; si no, lo añade con cantidad 1.
- `removeFromCart(cart: Cart, coffeeId: number): Cart` → lo quita.
- `changeQuantity(cart: Cart, coffeeId: number, quantity: number): Cart` → pone esa cantidad; si es 0 o menos, lo quita.
- `cartTotal(cart: Cart, list: Coffee[]): number` → el total, usando `finalPrice` (con descuentos). Si un `coffeeId` no existe en el catálogo, cuenta como 0.

Prohibido: `push`, `splice`, `item.quantity++` o `item.quantity = …`.

```ts
const empty: Cart = [];
const cart1 = addToCart(empty, 1);
const cart2 = addToCart(cart1, 4);
const cart3 = addToCart(cart2, 1);
const cart4 = changeQuantity(cart3, 4, 3);
const cart5 = removeFromCart(cart4, 1);
const cart6 = changeQuantity(cart5, 4, 0);

console.log(cart3); // → [{ coffeeId: 1, quantity: 2 }, { coffeeId: 4, quantity: 1 }]
console.log(cart4); // → [{ coffeeId: 1, quantity: 2 }, { coffeeId: 4, quantity: 3 }]
console.log(cart5); // → [{ coffeeId: 4, quantity: 3 }]
console.log(cart6); // → []

// Los carritos anteriores no han cambiado
console.log(empty); // → []
console.log(cart1); // → [{ coffeeId: 1, quantity: 1 }]

// Sólo se copia lo que cambia
console.log(cart3 === cart2);       // → false. Es un carrito nuevo
console.log(cart3[0] === cart2[0]); // → false. El café 1 cambió: es un objeto nuevo
console.log(cart3[1] === cart2[1]); // → true. El café 4 no cambió: se comparte

console.log(formatPrice(cartTotal(cart4, coffees))); // → "58.32 €"
console.log(formatPrice(cartTotal([{ coffeeId: 99, quantity: 1 }], coffees))); // → "0.00 €"
```

> 💡 Si `cart3[1] === cart2[1]` os da `false`, estáis copiando de más. Repasad el `map` del tema 25: a los elementos que no cambian, devolvedlos tal cual.

### O7 · ¿Pura o impura? (tema 22)

Fichero `o07-pureza.ts`. Copiad estas seis funciones y, para cada una, poned un comentario diciendo si es **pura** o **impura** y **qué condición rompe**. Después, escribid una versión pura de las impuras.

```ts
// 1
let shippingCost = 3.5;
const totalWithShipping = (amount: number): number => amount + shippingCost;

// 2
const applyDiscount = (coffee: Coffee, rate: number): Coffee => {
  coffee.price = coffee.price * (1 - rate);
  return coffee;
};

// 3
const namesInCapitals = (list: Coffee[]): string[] =>
  list.map((coffee) => coffee.name.toUpperCase());

// 4
const sortByPrice = (list: Coffee[]): Coffee[] =>
  list.sort((a, b) => a.price - b.price);

// 5
const createOrderId = (): string => `ORD-${Date.now()}`;

// 6
const buildTags = (coffee: Coffee): string[] => {
  const tags: string[] = [];
  for (const note of coffee.notes) {
    tags.push(`#${note}`);
  }
  return tags;
};
```

> 🪤 Ojo con la 6: tiene un `push`… ¿rompe la pureza? (tema 22, "Mutar dentro es aceptable").

### O8 · Uniones, `Record` y genéricos (temas 13, 14 y 15)

Fichero `o08-uniones-genericos.ts`:

1. Un alias `OrderStatus` con los estados `"pending"`, `"roasting"`, `"shipped"` y `"delivered"`.
2. Un objeto `statusLabel: Record<OrderStatus, string>` con su texto en castellano ("Pendiente", "Tostando", "Enviado", "Entregado") y una función `statusMessage(status: OrderStatus): string` que lo use.
3. `normalizeId(id: string | number): number` → los ids llegan como número desde la base de datos y como texto desde la URL. Usad una guarda con `typeof`.
4. Una función **genérica** `findById` que valga para **cualquier lista de objetos con `id`**: cafés, clientes… Devuelve el elemento o `null`.

```ts
const findById = <T extends { id: number }>(items: T[], id: number): T | null => {
  // ...
};
```

```ts
console.log(statusMessage("roasting")); // → "Tu pedido está: Tostando"

console.log(normalizeId("4")); // → 4
console.log(normalizeId(4));   // → 4

console.log(findById(coffees, normalizeId("4"))?.name ?? "No encontrado"); // → "Brasil Cerrado"
console.log(findById(customers, 3)?.email ?? "No encontrado");            // → "ana@mail.com"
console.log(findById(coffees, 99)?.name ?? "No encontrado");              // → "No encontrado"
```

> 🔍 **Probad esto:** borrad `delivered` de `statusLabel` y apuntad el error. Pasad el ratón por encima de `findById(coffees, 4)` y de `findById(customers, 3)`: ¿qué tipo devuelve en cada caso? Ponedlo en un comentario.

### O9 · Tipos de utilidad (tema 15)

Fichero `o09-utilidad.ts`. Nada de copiar interfaces a mano: derivadlas de `Coffee`.

- `CoffeePreview` = sólo `id`, `name` y `price` (con `Pick`), y `toPreview(coffee: Coffee): CoffeePreview` que **construya un objeto nuevo** sólo con esas tres propiedades.
- `NewCoffee` = un café sin `id` (con `Omit`), y `createCoffee(data: NewCoffee, list: Coffee[]): Coffee` que le asigne como `id` el mayor de la lista + 1.
- `updateCoffee(coffee: Coffee, changes: Partial<NewCoffee>): Coffee` → aplica los cambios con spread. Al usar `NewCoffee`, el `id` no se puede cambiar.
- `countByRoast(list: Coffee[]): Record<Roast, number>` → cuántos cafés hay de cada tueste.

```ts
console.log(toPreview(coffees[0]));
// → { id: 1, name: "Etiopía Yirgacheffe", price: 14.9 }

console.log(
  createCoffee(
    {
      name: "Ruanda Nyamasheke",
      origin: "Ruanda",
      notes: ["melocotón", "té verde"],
      roast: "light",
      price: 16.4,
      stock: 10,
    },
    coffees,
  ),
);
// → { id: 7, name: "Ruanda Nyamasheke", origin: "Ruanda", ... }

const cheaper = updateCoffee(coffees[1], { price: 11.9, stock: 10 });
console.log(cheaper.price, cheaper.stock);         // → 11.9 10
console.log(coffees[1].price, coffees[1].stock);   // → 12.9 3. Intacto

console.log(countByRoast(coffees)); // → { light: 2, medium: 2, dark: 2 }
```

> 💡 Para el `id` máximo: `Math.max(...lista de ids)`. Ese `...` es spread en argumentos (tema 21).

### O10 · Closures (tema 23)

Fichero `o10-closures.ts`:

- `createDiscount(rate: number): PriceRule` → devuelve una función que aplica ese descuento a un precio. Definid antes el alias `type PriceRule = (price: number) => number;`
- `createOrderIdGenerator(prefix: string): () => string` → devuelve una función que, cada vez que se llama, genera el siguiente id: `"TUE-1"`, `"TUE-2"`… Cada generador lleva **su propia cuenta**.

```ts
const blackFriday = createDiscount(0.2);
const members = createDiscount(0.1);

console.log(blackFriday(10)); // → 8
console.log(members(10));     // → 9
console.log([10, 20, 15].map(blackFriday)); // → [8, 16, 12]

const nextOrderId = createOrderIdGenerator("TUE");
const nextGiftId = createOrderIdGenerator("REGALO");

console.log(nextOrderId()); // → "TUE-1"
console.log(nextOrderId()); // → "TUE-2"
console.log(nextGiftId());  // → "REGALO-1"
console.log(nextOrderId()); // → "TUE-3"
```

> 📝 Comentad: ¿por qué en `.map(blackFriday)` no ponemos paréntesis después de `blackFriday`? ¿`blackFriday` es pura? ¿Y `nextOrderId`?

### O11 · Immer (temas 21 y 26)

Fichero `o11-immer.ts`. Una suscripción tiene datos anidados a varios niveles:

```ts
import { produce } from "immer";

interface Subscription {
  customer: { name: string; address: { city: string; zip: string } };
  plan: { name: "Básico" | "Popular" | "Pro"; bagsPerMonth: number };
  deliveries: string[];
}

const subscription: Subscription = {
  customer: { name: "Lucía", address: { city: "Málaga", zip: "29005" } },
  plan: { name: "Popular", bagsPerMonth: 2 },
  deliveries: ["2026-09-05", "2026-10-05"],
};
```

1. Cambiad la ciudad a `"Sevilla"` **con spread** (`movedSpread`). Vais a necesitar uno por nivel.
2. Haced el mismo cambio **con `produce`** (`movedImmer`).
3. Con un solo `produce` (`upgraded`): pasad al plan `"Pro"` con 3 bolsas y añadid la entrega `"2026-11-05"` con `push`.
4. Comprobad lo que ha pasado:

```ts
console.log(movedSpread.customer.address.city);  // → "Sevilla"
console.log(movedImmer.customer.address.city);   // → "Sevilla"
console.log(subscription.customer.address.city); // → "Málaga". Intacto

console.log(movedImmer.customer === subscription.customer); // → false. Cambió
console.log(movedImmer.plan === subscription.plan);         // → true. No cambió: se comparte

console.log(upgraded.plan);           // → { name: "Pro", bagsPerMonth: 3 }
console.log(upgraded.deliveries);     // → ["2026-09-05", "2026-10-05", "2026-11-05"]
console.log(subscription.plan);       // → { name: "Popular", bagsPerMonth: 2 }
console.log(subscription.deliveries); // → ["2026-09-05", "2026-10-05"]

console.log(produce(subscription, () => {}) === subscription); // → true
console.log(Object.isFrozen(upgraded.plan));                   // → true
```

> 📝 En un comentario: ¿qué versión os parece más legible, la de spread o la de Immer? ¿Cuándo usaríais cada una?

### O12 · README + bitácora de IA

El `README.md` del repo tiene que incluir:

1. **Cómo arrancarlo** (`npm install` + `npm run dev`) y dónde se ve la salida.
2. Una **captura de la consola** con la salida de las katas.
3. Confirmación de que **`npx tsc` sale sin errores**.
4. Las respuestas a las preguntas marcadas con 📝 y 🔍 (o un enlace a los comentarios del código donde están).
5. **Checklist** de obligatorios / opcionales / desafíos hechos.
6. 🤖 **Bitácora de IA**: qué herramienta(s) habéis usado y **al menos 3 ejemplos** con este formato:

```md
### Prompt

"Hazme una función addToCart que añada un café al carrito..."

### Qué me dio

Un forEach que hacía item.quantity++ sobre el carrito que recibía, y un push.

### Qué corregí y por qué

Lo cambié por map + spread: mutaba el carrito original, y cart1 cambiaba al crear cart3.
```

> 💡 Igual que en el módulo 1: lo interesante de la bitácora **no** es que la IA lo hiciera bien, sino **lo que tuvisteis que arreglar**.

---

## ⭐ Parte 2 · Opcionales

Suben nota. Haced los que más os apetezcan (recomendamos **al menos 3**).

### P1 · Tests con Vitest 🧪

En lugar de mirar la consola, que lo compruebe una herramienta. Instalad [Vitest](https://vitest.dev/) (`npm install -D vitest`) y convertid las salidas esperadas de **O5 y O6** en tests:

```ts
import { describe, expect, it } from "vitest";

describe("addToCart", () => {
  it("no modifica el carrito original", () => {
    const empty: Cart = [];
    addToCart(empty, 1);
    expect(empty).toEqual([]);
  });
});
```

Las funciones puras son las más fáciles de probar del mundo: entrada → salida, sin preparar nada.

### P2 · Deshacer en el carrito ↩️

Como cada cambio crea un carrito nuevo, guardar el historial es guardar referencias (tema 22, "Historial gratis"). Cread un pequeño gestor con un closure:

```ts
const history = createCartHistory();
history.add(1);
history.add(4);
history.undo();
console.log(history.current()); // → [{ coffeeId: 1, quantity: 1 }]
```

### P3 · Agrupar con `reduce`

`groupByRoast(list: Coffee[]): Record<Roast, Coffee[]>` usando **sólo `reduce`** y sin mutar el acumulador (devolved un objeto nuevo en cada vuelta con spread).

### P4 · Ordenar por cualquier propiedad

Una función genérica que ordene cualquier lista por la propiedad que le digáis, sin mutar:

```ts
const sortBy = <T, K extends keyof T>(items: T[], key: K): T[] => { /* ... */ };

sortBy(coffees, "price");
sortBy(customers, "name");
sortBy(coffees, "color"); // ❌ Tiene que dar error de TypeScript
```

Pista: `keyof` y `T[K]` (tema 14, restricciones). Para comparar textos, `localeCompare`.

### P5 · Datos desconocidos con `unknown`

Simulad que el catálogo llega de un servidor como texto:

```ts
const response = '{"id": 8, "name": "Perú Cajamarca", "price": 13.5}';
const data: unknown = JSON.parse(response);
```

Escribid `isCoffee(data: unknown): boolean` con **guardas de tipo** (`typeof`, `Array.isArray`, el operador `in`) que compruebe que tiene todas las propiedades de `Coffee` con su tipo correcto. Este ejemplo debe dar `false` (le faltan propiedades). Nada de `as Coffee` "por las buenas" (tema 10, _type assertion_).

### P6 · Vuestros propios `map` y `filter`

Implementad `myMap` y `myFilter` **genéricos** sin usar los nativos (tema 25, "Por dentro no tiene misterio"):

```ts
const myMap = <T, U>(items: T[], transform: (item: T, index: number) => U): U[] => { /* ... */ };

myMap(coffees, (coffee) => coffee.name); // string[]
myMap([1, 2, 3], (n) => n * 2);          // number[]
```

### P7 · Modelad los datos de vuestro TFM

Si ya tenéis TFM en mente, cread un `tfm-types.ts` con sus entidades principales: interfaces, al menos una unión de literales para estados o categorías, y tipos derivados con `Omit`/`Partial` para "crear" y "editar". Añadid **tres funciones puras** que trabajen con esos datos. Así ya tenéis el modelo listo para cuando lleguéis a React.

---

## 🔥 Parte 3 · Desafíos

Para quien quiera sufrir un poco (y aprender mucho). Cada uno cuenta como un plus importante.

### D1 · Pintad el catálogo en la landing del módulo 1

Juntad los dos laboratorios: usad `catalogLabels` (o algo parecido) para **generar las tarjetas de cafés** de la landing de _Tueste_ desde los datos, en vez de tenerlas escritas a mano en el HTML. El DOM no lo hemos visto en este módulo: investigad `document.querySelector` y `innerHTML` o `createElement`.

La regla: las funciones que construyen el HTML son **puras** (reciben datos, devuelven texto); sólo una función, la última, toca el DOM.

### D2 · Uniones discriminadas

Modelad los métodos de pago con una unión de objetos que comparten una propiedad `type`:

```ts
type PaymentMethod =
  | { type: "card"; last4: string }
  | { type: "bizum"; phone: string }
  | { type: "transfer"; iban: string };
```

Escribid `describePayment(method: PaymentMethod): string` con un `switch` sobre `method.type`. Dentro de cada `case`, TypeScript sabe qué propiedades existen. Y para terminar: añadid un `default` que haga que TypeScript **dé error si mañana alguien añade un método nuevo** y se olvida de contemplarlo. Pista: una función `assertNever(value: never): never`.

### D3 · Medid el coste de la inmutabilidad ⏱️

Reproducid el experimento del tema 22: un bucle de 20 000 vueltas con `list = [...list, i]` frente a otro con `push`. Medid con `performance.now()` y apuntad los tiempos en el README. Después explicad **por qué** `map`, aunque también crea un array nuevo, no tiene este problema.

### D4 · Un pedido como en React (reducer con Immer)

Preparad el terreno para el siguiente módulo. Definid las acciones posibles sobre un carrito como una unión discriminada:

```ts
type CartAction =
  | { type: "add"; coffeeId: number }
  | { type: "remove"; coffeeId: number }
  | { type: "changeQuantity"; coffeeId: number; quantity: number }
  | { type: "clear" };
```

Escribid `cartReducer(state: Cart, action: CartAction): Cart` usando `produce`: en cada `case`, mutad el borrador (o devolved un valor nuevo para `"clear"`). Aplicad una lista de acciones con `actions.reduce(cartReducer, [])` y mostrad el resultado.

### D5 · Vuestro propio `reduce`

Implementad `myReduce<T, A>(items: T[], reducer: (acc: A, item: T) => A, initial: A): A` y usadlo para reescribir `stockValue` y `countByRoast`. Importante: no podéis usar el método nativo de `Array.prototype.reduce` o `Array.prototype.reduceRight` por lo que las iteraciones las haréis usando bucles u otras estrategias.

---

## 🤖 Cómo sacarle partido a la IA (sin que os la cuele)

**Dadle contexto.** Un buen prompt incluye versión, tipos y restricciones:

```text
Estoy con TypeScript 6 en modo estricto, con erasableSyntaxOnly (no puedo usar
enum) y verbatimModuleSyntax. Tengo esta interfaz:

interface CartItem { coffeeId: number; quantity: number }
type Cart = CartItem[];

Escríbeme addToCart(cart, coffeeId) como función PURA: no puede mutar el
carrito que recibe ni sus elementos. Usa map/spread, nada de push ni ++.
Los elementos que no cambian deben devolverse tal cual (misma referencia).
```

**Pedidle que os explique**, no sólo que haga: _"¿esta función muta algo de lo que recibe?"_, _"¿por qué has puesto `??` y no `||`?"_, _"¿qué tipo infiere TypeScript aquí?"_.

**Revisad siempre esta lista**, porque es lo que la IA suele hacer mal:

|❌ Lo que suele hacer|✅ Qué hacer|
|---|---|
|`any` cuando no sabe el tipo|El tipo correcto, un genérico o `unknown` con guardas|
|`as Coffee` para que se calle un error|Arreglar el tipo: un `as` no convierte nada, sólo silencia|
|`enum Roast { Light, ... }`|Unión de literales: `type Roast = "light" \| "medium" \| "dark"`|
|`||
|`sort()` sobre el array que recibe|`toSorted()`|
|`map` que hace `item.quantity++` y devuelve `item`|`map` que devuelve `{ ...item, quantity: item.quantity + 1 }`|
|`forEach` + `push` para transformar o filtrar|`map` / `filter`|
|`JSON.parse(JSON.stringify(obj))` o lodash para copiar|Spread (superficial), `structuredClone` (profunda) o Immer|
|`import { Coffee } from "./types"`|`import type { Coffee } from "./types"` (por `verbatimModuleSyntax`)|
|Anotar todo, hasta `const n: number = 3`|Anotar parámetros y retornos; dejar que infiera el resto|

**Usad el editor**: pasar el ratón por encima de una variable os dice qué tipo ha inferido TypeScript. Es la forma más rápida de entender (y de pillar a la IA).

---

## 📬 Entrega

1. Repositorio **público** en GitHub (o privado dando acceso a los profesores).
2. En la raíz: el proyecto de Vite + el `README.md` de O12.
3. En el portal academia.lemoncode.net id a los laboratorios del módulo 2 y pegad el enlace a vuestro repo.

> ✋ No subáis `node_modules` (Vite ya os crea el `.gitignore`).

## 📊 Evaluación

|Bloque|Peso|
|---|---|
|Obligatorios O1-O11|50 %|
|README + bitácora de IA (O12)|10 %|
|Opcionales (P1-P7)|20 %|
|Desafíos (D1-D5)|15 %|
|Código limpio: buenos nombres, funciones cortas, tipos claros ✨|5 %|

- Para **aprobar**: todos los obligatorios hechos, con las salidas correctas y **`npx tsc` sin errores**.
    
- En la revisión podemos pediros que **expliquéis una kata** o que hagáis un **cambio pequeño en directo** (p. ej. "que `addToCart` reciba también la cantidad" o "que `findById` funcione con ids de tipo texto"). Es la forma de comprobar que el código es vuestro, lo haya escrito quien lo haya escrito.
    

## 📚 Recursos

- Los apuntes del módulo: [02-lenguajes](https://github.com/Lemoncode/luckia-front-end-moderno-ia/tree/main/02-lenguajes). Cada kata indica a qué tema volver.
- [TypeScript Playground](https://www.typescriptlang.org/play): para probar tipos sueltos sin montar nada.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) y [tipos de utilidad](https://www.typescriptlang.org/docs/handbook/utility-types.html).
- [MDN: métodos de Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array): cada método indica si muta o no.
- [Documentación de Immer](https://immerjs.github.io/immer/).

¡A darle al café! ☕