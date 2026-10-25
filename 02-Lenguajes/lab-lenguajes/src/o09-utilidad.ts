import { coffees } from "./data";
import type { Coffee, Roast } from "./types";

// 1 · `Pick` se queda sólo con las claves indicadas de `Coffee`. Si mañana
// cambia el tipo de `price` en `Coffee`, `CoffeePreview` cambia con él.
export type CoffeePreview = Pick<Coffee, "id" | "name" | "price">;

// Objeto nuevo con las tres propiedades: `return coffee` compilaría (le sobran
// propiedades, no le faltan), pero devolvería el café entero.
export const toPreview = ({ id, name, price }: Coffee): CoffeePreview => ({ id, name, price });

// 2 · `Omit` quita `id`: los datos de un café que todavía no existe.
export type NewCoffee = Omit<Coffee, "id">;

// `Math.max()` sin argumentos devuelve `-Infinity`; el `0` hace que el primer
// café de una lista vacía reciba el id 1. `id` va al final para que gane a
// cualquier `id` que `data` traiga en tiempo de ejecución.
export const createCoffee = (data: NewCoffee, list: Coffee[]): Coffee => {
  const id = Math.max(0, ...list.map((coffee) => coffee.id)) + 1;
  return { ...data, id };
};

// 3 · `Partial<NewCoffee>`: todas las propiedades opcionales y ninguna es `id`.
export const updateCoffee = (coffee: Coffee, changes: Partial<NewCoffee>): Coffee => ({
  ...coffee,
  ...changes,
});

// 🔍 Intentar cambiar el id:
// error TS2353: Object literal may only specify known properties, and 'id'
// does not exist in type 'Partial<NewCoffee>'.

// 4 · El acumulador arranca con las tres claves a 0: TypeScript infiere
// `{ light: number; medium: number; dark: number }`, que encaja con
// `Record<Roast, number>` sin anotarlo ni usar `as`.
export const countByRoast = (list: Coffee[]): Record<Roast, number> =>
  list.reduce(
    (counts, coffee) => ({ ...counts, [coffee.roast]: counts[coffee.roast] + 1 }),
    { light: 0, medium: 0, dark: 0 },
  );

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
// → { name: "Ruanda Nyamasheke", origin: "Ruanda", ..., stock: 10, id: 7 }
console.log(createCoffee({ ...coffees[0] }, []).id);
// → 1

const cheaper = updateCoffee(coffees[1], { price: 11.9, stock: 10 });
console.log(cheaper.price, cheaper.stock);
// → 11.9 10
console.log(coffees[1].price, coffees[1].stock);
// → 12.9 3
console.log(cheaper.notes === coffees[1].notes);
// → true (spread superficial: el array de notas se comparte)

console.log(countByRoast(coffees));
// → { light: 2, medium: 2, dark: 2 }
console.log(countByRoast([]));
// → { light: 0, medium: 0, dark: 0 }
