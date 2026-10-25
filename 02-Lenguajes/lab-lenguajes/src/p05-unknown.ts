import type { Coffee, Roast } from "./types";

// Lo que llega del servidor es texto: JSON.parse devuelve `any`, así que lo
// guardamos como `unknown` para que TypeScript nos obligue a comprobarlo.
const response = '{"id": 8, "name": "Perú Cajamarca", "price": 13.5}';
const data: unknown = JSON.parse(response);

// `item: unknown` porque Array.isArray estrecha a `any[]` y no queremos que
// ese `any` se cuele en el callback.
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item: unknown) => typeof item === "string");

const isRoast = (value: unknown): value is Roast =>
  value === "light" || value === "medium" || value === "dark";

// Cada `"x" in data` estrecha `data` a `object & Record<"x", unknown>`, así
// que `data.x` se puede leer sin `as`. `discount` es opcional: vale que no
// esté, pero si está tiene que ser un número.
export const isCoffee = (data: unknown): data is Coffee =>
  typeof data === "object" &&
  data !== null &&
  "id" in data &&
  typeof data.id === "number" &&
  "name" in data &&
  typeof data.name === "string" &&
  "origin" in data &&
  typeof data.origin === "string" &&
  "notes" in data &&
  isStringArray(data.notes) &&
  "roast" in data &&
  isRoast(data.roast) &&
  "price" in data &&
  typeof data.price === "number" &&
  "stock" in data &&
  typeof data.stock === "number" &&
  (!("discount" in data) || typeof data.discount === "number");

console.log(isCoffee(data));
// → false

const complete: unknown = JSON.parse(
  '{"id": 8, "name": "Perú Cajamarca", "origin": "Perú", "notes": ["chocolate", "nuez"], "roast": "medium", "price": 13.5, "stock": 7}',
);
console.log(isCoffee(complete));
// → true

const extraRoast: unknown = JSON.parse(
  '{"id": 9, "name": "Ruanda Nyamasheke", "origin": "Ruanda", "notes": ["ciruela"], "roast": "extra", "price": 14, "stock": 2}',
);
console.log(isCoffee(extraRoast));
// → false

// Lo que gana quien llama: dentro del `if`, `complete` ya es `Coffee`.
if (isCoffee(complete)) {
  console.log(`${complete.name} (${complete.roast}) · ${complete.notes.join(", ")}`);
  // → "Perú Cajamarca (medium) · chocolate, nuez"
}

// Y `filter` usa el predicado para devolver `Coffee[]`, no `unknown[]`.
const valid = [data, complete, extraRoast].filter(isCoffee);
console.log(valid.map((coffee) => coffee.id));
// → [8]
