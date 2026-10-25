import { coffees, customers } from "./data";

// 1 · Unión de literales en vez de `enum` (erasableSyntaxOnly).
export type OrderStatus = "pending" | "roasting" | "shipped" | "delivered";

// 2 · `Record<OrderStatus, string>` obliga a tener una clave por cada estado:
// si falta una o sobra otra, `tsc` da error.
export const statusLabel: Record<OrderStatus, string> = {
  pending: "Pendiente",
  roasting: "Tostando",
  shipped: "Enviado",
  delivered: "Entregado",
};

// 🔍 Sin `delivered`:
// error TS2741: Property 'delivered' is missing in type '{ pending: string;
// roasting: string; shipped: string; }' but required in type
// 'Record<OrderStatus, string>'.

export const statusMessage = (status: OrderStatus): string =>
  `Tu pedido está: ${statusLabel[status]}`;

// 3 · Guarda con `typeof`: en cada rama TypeScript estrecha `id` a `number` o
// a `string`.
export const normalizeId = (id: string | number): number =>
  typeof id === "number" ? id : Number(id);

// 4 · Genérica: vale para cualquier lista cuyos elementos tengan `id: number`.
// `find` devuelve `T | undefined`; `?? null` lo convierte en `T | null`.
export const findById = <T extends { id: number }>(items: T[], id: number): T | null =>
  items.find((item) => item.id === id) ?? null;

// 🔍 Tipos inferidos:
// findById(coffees, 4)   → Coffee | null
// findById(customers, 3) → Customer | null

console.log(statusMessage("roasting"));
// → "Tu pedido está: Tostando"

console.log(normalizeId("4"));
// → 4
console.log(normalizeId(4));
// → 4

console.log(findById(coffees, normalizeId("4"))?.name ?? "No encontrado");
// → "Brasil Cerrado"
console.log(findById(customers, 3)?.email ?? "No encontrado");
// → "ana@mail.com"
console.log(findById(coffees, 99)?.name ?? "No encontrado");
// → "No encontrado"
