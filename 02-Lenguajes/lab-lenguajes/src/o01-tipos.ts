// Errores provocados a propósito. Descomentad un bloque (y los imports) y
// ejecutad `npx tsc` para verlos.

// import type { Coffee } from "./types";
// import { coffees } from "./data";

// 1. Un café con un tueste que no existe
// const extraRoast: Coffee = {
//   id: 99,
//   name: "Brasil Santos",
//   origin: "Brasil",
//   notes: ["chocolate"],
//   roast: "extra",
//   price: 11.5,
//   stock: 3,
// };
// → error TS2322: Type '"extra"' is not assignable to type 'Roast'.

// 2. Un café sin price
// const noPrice: Coffee = {
//   id: 100,
//   name: "Guatemala Antigua",
//   origin: "Guatemala",
//   notes: ["cacao", "especias"],
//   roast: "medium",
//   stock: 7,
// };
// → error TS2741: Property 'price' is missing in type '{ id: number; name: string; origin: string; notes: string[]; roast: "medium"; stock: number; }' but required in type 'Coffee'.

// 3. Cambiar el id de coffees[0]
// coffees[0].id = 42;
// → error TS2540: Cannot assign to 'id' because it is a read-only property.

export {};
