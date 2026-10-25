import type { Coffee } from "./types";
import { coffees } from "./data";
import { formatPrice } from "./o02-funciones";

export function coffeeCard({ name, origin, price }: Coffee): string {
  return `${name} (${origin}) · ${formatPrice(price)}`;
}

export function mainNote(coffee: Coffee): string {
  const [first, ...others] = coffee.notes;
  return `${first} y ${others.length} más`;
}

export function toPublicCoffee({ stock, ...publicCoffee }: Coffee): Omit<Coffee, "stock"> {
  return publicCoffee;
}

export function sumAll(...amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

console.log(coffeeCard(coffees[0]));
// → "Etiopía Yirgacheffe (Etiopía) · 14.90 €"
console.log(mainNote(coffees[0]));
// → "floral y 2 más"
console.log(mainNote(coffees[1]));
// → "caramelo y 1 más"

console.log(toPublicCoffee(coffees[1]));
// → { id: 2, name: "Colombia Huila", origin: "Colombia",
//     notes: ["caramelo", "manzana roja"], roast: "medium", price: 12.9 }
console.log(coffees[1].stock);
// → 3. El original sigue teniendo stock

console.log(sumAll(1, 2, 3));
// → 6
console.log(sumAll());
// → 0
console.log(sumAll(...coffees.map((coffee) => coffee.stock)));
// → 48
// 📝 Este `...` no es rest, es spread: está en una llamada, no en una
// declaración de parámetros. Rest recoge varios valores en un array
// (`...amounts` en la firma de sumAll); spread hace lo contrario, despliega el
// array `[12, 3, 0, 25, 8, 0]` en argumentos sueltos, como si escribiéramos
// sumAll(12, 3, 0, 25, 8, 0). Dentro de sumAll, rest los vuelve a juntar.
