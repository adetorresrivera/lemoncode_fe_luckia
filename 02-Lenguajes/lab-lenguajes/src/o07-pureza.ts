import type { Coffee } from "./types";
import { coffees } from "./data";
import { formatPrice } from "./o02-funciones";

// Las originales se exportan para que noUnusedLocals no las marque como no
// usadas. No se llaman sobre `coffees`: la 2 y la 4 lo mutarían para el resto
// de katas.

// 1 · IMPURA: depende de algo de fuera. Lee `shippingCost`, un `let` que
// cualquiera puede reasignar, así que la misma entrada puede dar otra salida.
export let shippingCost = 3.5;
export const totalWithShipping = (amount: number): number => amount + shippingCost;

// 2 · IMPURA: muta la entrada. Cambia `coffee.price` del objeto recibido
// (efecto secundario) y devuelve esa misma referencia.
export const applyDiscount = (coffee: Coffee, rate: number): Coffee => {
  coffee.price = coffee.price * (1 - rate);
  return coffee;
};

// 3 · PURA: solo usa sus parámetros, no muta nada (`map` crea un array nuevo
// y `toUpperCase` un string nuevo) y es determinista.
export const namesInCapitals = (list: Coffee[]): string[] =>
  list.map((coffee) => coffee.name.toUpperCase());

// 4 · IMPURA: muta la entrada. `sort` ordena el array recibido in situ y
// devuelve la misma referencia.
export const sortByPrice = (list: Coffee[]): Coffee[] =>
  list.sort((a, b) => a.price - b.price);

// 5 · IMPURA: no es determinista. `Date.now()` devuelve un valor distinto en
// cada llamada, así que la misma entrada (ninguna) da salidas distintas.
export const createOrderId = (): string => `ORD-${Date.now()}`;

// 6 · PURA: el `push` muta `tags`, que es un array local creado dentro de la
// función. Nadie de fuera lo ve hasta que se devuelve; `coffee` no se toca.
export const buildTags = (coffee: Coffee): string[] => {
  const tags: string[] = [];
  for (const note of coffee.notes) {
    tags.push(`#${note}`);
  }
  return tags;
};

// Versiones puras

export const totalWithShippingPure = (amount: number, shippingCost: number): number =>
  amount + shippingCost;

export const applyDiscountPure = (coffee: Coffee, rate: number): Coffee => ({
  ...coffee,
  price: coffee.price * (1 - rate),
});

export const sortByPricePure = (list: Coffee[]): Coffee[] =>
  list.toSorted((a, b) => a.price - b.price);

export const createOrderIdPure = (now: () => number): string => `ORD-${now()}`;

console.log(formatPrice(totalWithShippingPure(14.9, 3.5)));
// → "18.40 €"

const [etiopia] = coffees;
const discounted = applyDiscountPure(etiopia, 0.1);
console.log(formatPrice(discounted.price), formatPrice(etiopia.price));
// → "13.41 €" "14.90 €"
console.log(discounted === etiopia, discounted.notes === etiopia.notes);
// → false true

const sorted = sortByPricePure(coffees);
console.log(sorted.map((coffee) => coffee.price));
// → [10.5, 12.9, 13.2, 13.9, 14.9, 15.5]
console.log(coffees[0].name, sorted === coffees);
// → "Etiopía Yirgacheffe" false

console.log(createOrderIdPure(() => 1700000000000));
// → "ORD-1700000000000"

console.log(namesInCapitals(coffees.slice(0, 2)));
// → ["ETIOPÍA YIRGACHEFFE", "COLOMBIA HUILA"]
console.log(buildTags(etiopia));
// → ["#floral", "#bergamota", "#té negro"]
