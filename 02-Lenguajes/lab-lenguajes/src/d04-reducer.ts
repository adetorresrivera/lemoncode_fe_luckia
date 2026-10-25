import { produce } from "immer";
import type { Cart } from "./o06-carrito";
import { addToCart, changeQuantity, removeFromCart } from "./o06-carrito";
import { assertNever } from "./d02-pagos";

export type CartAction =
  | { type: "add"; coffeeId: number }
  | { type: "remove"; coffeeId: number }
  | { type: "changeQuantity"; coffeeId: number; quantity: number }
  | { type: "clear" };

// Dentro de la receta `draft` es un borrador de `Cart`: `find` devuelve un
// borrador del elemento, y `push`, `splice` o `+=` actúan sobre el borrador,
// nunca sobre `state`.
export const cartReducer = (state: Cart, action: CartAction): Cart =>
  produce(state, (draft) => {
    switch (action.type) {
      case "add": {
        const item = draft.find((candidate) => candidate.coffeeId === action.coffeeId);
        if (item) {
          item.quantity += 1;
        } else {
          draft.push({ coffeeId: action.coffeeId, quantity: 1 });
        }
        break;
      }
      case "remove": {
        const index = draft.findIndex((candidate) => candidate.coffeeId === action.coffeeId);
        // Sin esta guarda, `splice(-1, 1)` quitaría el último elemento.
        if (index !== -1) {
          draft.splice(index, 1);
        }
        break;
      }
      case "changeQuantity": {
        const index = draft.findIndex((candidate) => candidate.coffeeId === action.coffeeId);
        if (index === -1) {
          break;
        }
        if (action.quantity <= 0) {
          draft.splice(index, 1);
        } else {
          draft[index].quantity = action.quantity;
        }
        break;
      }
      case "clear":
        // Reasignar `draft = []` solo cambiaría la variable local: Immer no lo
        // ve. Para sustituir el estado entero hay que devolver el valor nuevo
        // (y sin haber tocado el borrador).
        return [];
      default:
        return assertNever(action);
    }
  });

// La misma secuencia con las funciones puras de O6, para comparar.
const cartReducerO6 = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case "add":
      return addToCart(state, action.coffeeId);
    case "remove":
      return removeFromCart(state, action.coffeeId);
    case "changeQuantity":
      return changeQuantity(state, action.coffeeId, action.quantity);
    case "clear":
      return [];
    default:
      return assertNever(action);
  }
};

const sameCart = (a: Cart, b: Cart): boolean =>
  a.length === b.length &&
  a.every(
    (item, index) => item.coffeeId === b[index].coffeeId && item.quantity === b[index].quantity,
  );

const actions: CartAction[] = [
  { type: "add", coffeeId: 1 },
  { type: "add", coffeeId: 4 },
  { type: "add", coffeeId: 1 },
  { type: "changeQuantity", coffeeId: 4, quantity: 3 },
  { type: "add", coffeeId: 2 },
  { type: "remove", coffeeId: 1 },
  { type: "changeQuantity", coffeeId: 2, quantity: 0 },
  { type: "remove", coffeeId: 99 },
  { type: "add", coffeeId: 3 },
];

const withImmer = actions.reduce(cartReducer, []);
const withO6 = actions.reduce(cartReducerO6, []);

console.log(withImmer);
// → [{ coffeeId: 4, quantity: 3 }, { coffeeId: 3, quantity: 1 }]
console.log(withO6);
// → [{ coffeeId: 4, quantity: 3 }, { coffeeId: 3, quantity: 1 }]
console.log(sameCart(withImmer, withO6));
// → true

const withClear: CartAction[] = [...actions, { type: "clear" }];
const cleared = withClear.reduce(cartReducer, []);
console.log(cleared);
// → []

// Si la acción no cambia nada, Immer devuelve el mismo estado; `filter` de O6
// siempre crea un array nuevo.
const before: Cart = [{ coffeeId: 4, quantity: 3 }];
console.log(cartReducer(before, { type: "remove", coffeeId: 99 }) === before);
// → true
console.log(cartReducerO6(before, { type: "remove", coffeeId: 99 }) === before);
// → false

// Lo que no cambia se comparte, igual que en O6.
const added = cartReducer(before, { type: "add", coffeeId: 1 });
console.log(added[0] === before[0]);
// → true
console.log(Object.isFrozen(added));
// → true

// ⚠️ Mutar el borrador Y devolver otra cosa lanza un error en tiempo de
// ejecución (tsc no lo detecta):
// produce(before, (draft) => {
//   draft.push({ coffeeId: 1, quantity: 1 });
//   return [];
// });
// → Error: [Immer] An immer producer returned a new value *and* modified its
//   draft. Either return a new value *or* modify the draft.
