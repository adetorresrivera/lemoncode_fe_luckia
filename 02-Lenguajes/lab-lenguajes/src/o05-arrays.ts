import type { Coffee } from "./types";
import { coffees } from "./data";
import { formatPrice } from "./o02-funciones";
import { coffeeCard } from "./o03-destructuring";

export function availableCoffees(list: Coffee[]): Coffee[] {
  return list.filter((coffee) => coffee.stock > 0);
}

export function catalogLabels(list: Coffee[]): string[] {
  return list
    .filter((coffee) => coffee.stock > 0)
    .toSorted((a, b) => a.price - b.price)
    .map(coffeeCard);
}

export function stockValue(list: Coffee[]): number {
  return list.reduce((total, coffee) => total + coffee.price * coffee.stock, 0);
}

console.log(availableCoffees(coffees).map((coffee) => coffee.name));
// → ["Etiopía Yirgacheffe", "Colombia Huila", "Brasil Cerrado", "Guatemala Antigua"]

console.log(catalogLabels(coffees));
// → ["Brasil Cerrado (Brasil) · 10.50 €",
//    "Colombia Huila (Colombia) · 12.90 €",
//    "Guatemala Antigua (Guatemala) · 13.20 €",
//    "Etiopía Yirgacheffe (Etiopía) · 14.90 €"]

console.log(formatPrice(stockValue(coffees)));
// → "585.60 €"

console.log(coffees.some((coffee) => coffee.stock === 0));
// → true
console.log(coffees.every((coffee) => coffee.notes.length > 0));
// → true
console.log(coffees.find((coffee) => coffee.id === 4)?.name ?? "No existe");
// → "Brasil Cerrado"
console.log(coffees.find((coffee) => coffee.id === 99)?.name ?? "No existe");
// → "No existe"

console.log(coffees.map((coffee) => coffee.name));
// → ["Etiopía Yirgacheffe", "Colombia Huila", "Kenia AA",
//    "Brasil Cerrado", "Guatemala Antigua", "Sumatra Mandheling"]
// 🔍 Con `sort` en vez de `toSorted` en catalogLabels, esta línea sale IGUAL.
// `sort` sí ordena "in situ", pero aquí ordena el array que acaba de crear
// `filter`, no `coffees`: filter devuelve un array nuevo (con referencias a los
// mismos objetos café), así que lo que se reordena es esa copia intermedia.
// La trampa aparece si quitamos el filter o lo movemos detrás: con
// `list.sort(...)` el que se reordena es el `coffees` del módulo data.ts, y
// esta línea pasa a dar:
// → ["Brasil Cerrado", "Colombia Huila", "Guatemala Antigua",
//    "Sumatra Mandheling", "Etiopía Yirgacheffe", "Kenia AA"]
// Que funcione con `sort` depende del orden de la cadena; con `toSorted` no
// muta nunca, se cambie lo que se cambie. Por eso volvemos a `toSorted`.
