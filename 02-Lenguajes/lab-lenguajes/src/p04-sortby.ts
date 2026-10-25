import { coffees, customers } from "./data";

// Claves de T cuyo valor es V. El `-?` quita la opcionalidad para que las
// claves opcionales no cuelen `undefined` en la unión final; aun así,
// `discount` queda fuera porque `number | undefined` no extiende `number`.
// `[keyof T]` al final convierte el objeto { clave: clave | never } en la
// unión de las claves que han sobrevivido.
type KeysOfType<T, V> = {
  [P in keyof T]-?: T[P] extends V ? P : never;
}[keyof T];

// Restringir K impide llamar con `notes`, `address` o `color`, pero dentro
// TypeScript sigue viendo `T[K]` y no lo relaciona con `string | number`:
// las guardas `typeof` lo estrechan sin `as`.
export const sortBy = <T, K extends KeysOfType<T, string | number>>(
  items: readonly T[],
  key: K,
): T[] =>
  items.toSorted((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (typeof va === "string" && typeof vb === "string") {
      return va.localeCompare(vb, "es");
    }
    if (typeof va === "number" && typeof vb === "number") {
      return va - vb;
    }
    // Tipos mezclados: no se mueven (toSorted es estable).
    return 0;
  });

console.log(sortBy(coffees, "price").map((c) => `${c.name} ${c.price}`));
// → ["Brasil Cerrado 10.5", "Colombia Huila 12.9", "Guatemala Antigua 13.2",
//    "Sumatra Mandheling 13.9", "Etiopía Yirgacheffe 14.9", "Kenia AA 15.5"]

console.log(sortBy(customers, "name").map((c) => c.name));
// → ["Ana", "Lucía", "Marcos"]

// El original no se ha tocado
console.log(coffees.map((c) => c.id));
// → [1, 2, 3, 4, 5, 6]

// sortBy(coffees, "color");
// error TS2345: Argument of type '"color"' is not assignable to parameter of type 'KeysOfType<Coffee, string | number>'.
