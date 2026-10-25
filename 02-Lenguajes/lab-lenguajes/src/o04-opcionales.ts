import type { Coffee, Customer } from "./types";
import { coffees, customers } from "./data";
import { formatPrice } from "./o02-funciones";

export function getCity(customer: Customer): string {
  return customer.address?.city ?? "Sin dirección";
}

export function getGrind(customer: Customer): "grano" | "molido" {
  return customer.preferences?.grind ?? "grano";
}

export function wantsNewsletter(customer: Customer): boolean {
  return customer.preferences?.newsletter ?? true;
}

export function finalPrice(coffee: Coffee): number {
  return coffee.price * (1 - (coffee.discount ?? 0));
}

for (const customer of customers) {
  console.log(
    `${customer.name} · ${getCity(customer)} · ${getGrind(customer)} · newsletter: ${wantsNewsletter(customer)}`,
  );
}
// → Lucía · Málaga · molido · newsletter: false
// → Marcos · Sin dirección · grano · newsletter: true
// → Ana · Madrid · grano · newsletter: true

console.log(formatPrice(finalPrice(coffees[0])));
// → "13.41 €" (10 % de descuento)
console.log(formatPrice(finalPrice(coffees[1])));
// → "12.90 €" (sin descuento)
console.log(formatPrice(finalPrice(coffees[2])));
// → "15.50 €" (descuento 0)
// 📝 Con `||` también saldría 15.50: `0 || 0` vuelve a dar 0. El operador
// "incorrecto" sólo cambia el resultado cuando el valor falsy que descarta es
// distinto del valor por defecto; aquí coinciden, así que no se nota.
console.log(formatPrice(finalPrice(coffees[4])));
// → "11.22 €" (15 %)

// 🪤 La trampa
export function wantsNewsletterOr(customer: Customer): boolean {
  return customer.preferences?.newsletter || true;
}

console.log(wantsNewsletterOr(customers[0]));
// → true
// 📝 Lucía tiene `newsletter: false`. `||` devuelve el lado derecho cuando el
// izquierdo es falsy (false, 0, "", NaN, null, undefined), y `false` es falsy:
// `false || true` → true. Su "no" se trata igual que si no hubiera contestado.
// `??` sólo salta al lado derecho con null o undefined, así que respeta el
// false: `false ?? true` → false.
