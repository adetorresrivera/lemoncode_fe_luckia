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

// Un spread por cada nivel que hay que atravesar hasta `city`: la raíz,
// `customer` y `address`. Lo que no se toca (`plan`, `deliveries`, `name`,
// `zip`) se copia como referencia: es el mismo objeto que en `subscription`.
const movedSpread: Subscription = {
  ...subscription,
  customer: {
    ...subscription.customer,
    address: { ...subscription.customer.address, city: "Sevilla" },
  },
};

// Dentro de la receta `draft` es un borrador: se escribe como si se mutara y
// Immer construye la copia, rehaciendo solo el camino hasta lo modificado.
const movedImmer = produce(subscription, (draft) => {
  draft.customer.address.city = "Sevilla";
});

// Un solo produce con varios cambios. El `push` actúa sobre el borrador de
// `deliveries`, no sobre el array de `subscription`.
const upgraded = produce(subscription, (draft) => {
  draft.plan.name = "Pro";
  draft.plan.bagsPerMonth = 3;
  draft.deliveries.push("2026-11-05");
});

console.log(movedSpread.customer.address.city);
// → "Sevilla"
console.log(movedImmer.customer.address.city);
// → "Sevilla"
console.log(subscription.customer.address.city);
// → "Málaga". Intacto

console.log(movedImmer.customer === subscription.customer);
// → false. Cambió
console.log(movedImmer.plan === subscription.plan);
// → true. No cambió: se comparte

console.log(upgraded.plan);
// → { name: "Pro", bagsPerMonth: 3 }
console.log(upgraded.deliveries);
// → ["2026-09-05", "2026-10-05", "2026-11-05"]
console.log(subscription.plan);
// → { name: "Popular", bagsPerMonth: 2 }
console.log(subscription.deliveries);
// → ["2026-09-05", "2026-10-05"]

console.log(produce(subscription, () => {}) === subscription);
// → true
console.log(Object.isFrozen(upgraded.plan));
// → true

// 📝 ¿Spread o Immer?
// Para cambiar `city`, Immer se lee mejor: una línea que dice exactamente qué
// cambia, frente a tres spreads anidados donde lo importante (`city:
// "Sevilla"`) queda enterrado al final y es fácil olvidar un nivel (y perder
// `zip` o `name` sin que TypeScript siempre avise si el campo es opcional).
// Spread cuando el cambio es plano o de un solo nivel
// (`{ ...item, quantity: item.quantity + 1 }`): se entiende sin conocer
// ninguna librería y no añade dependencias. Immer cuando hay que bajar dos o
// más niveles, o hacer varios cambios a la vez (como en `upgraded`), o
// trabajar con arrays dentro de objetos, donde `push` o `splice` sobre el
// borrador es más claro que reconstruir el array a mano.
