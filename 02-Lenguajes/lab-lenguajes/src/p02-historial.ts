import type { Cart } from "./o06-carrito";
import { addToCart, removeFromCart } from "./o06-carrito";

export interface CartHistory {
  add: (coffeeId: number) => void;
  remove: (coffeeId: number) => void;
  undo: () => void;
  current: () => Cart;
}

// `history` queda capturado en el closure: solo las cuatro funciones
// devueltas pueden leerlo o cambiarlo. El último elemento es el carrito
// actual; empieza con el carrito vacío para que siempre haya uno.
export const createCartHistory = (): CartHistory => {
  let history: Cart[] = [[]];

  const current = (): Cart => history[history.length - 1] ?? [];

  // No se hace `push`: se reasigna `history` con un array nuevo. Los carritos
  // que ya estaban se comparten, no se copian.
  const save = (cart: Cart): void => {
    history = [...history, cart];
  };

  return {
    add: (coffeeId) => save(addToCart(current(), coffeeId)),
    remove: (coffeeId) => save(removeFromCart(current(), coffeeId)),
    // Con solo el carrito inicial no hay nada que deshacer: no hace nada.
    undo: () => {
      if (history.length > 1) {
        history = history.slice(0, -1);
      }
    },
    current,
  };
};

// El ejemplo de lab.md
const history = createCartHistory();
history.add(1);
history.add(4);
history.undo();
console.log(history.current());
// → [{ coffeeId: 1, quantity: 1 }]

// Varios undo seguidos
const shop = createCartHistory();
shop.add(1);
shop.add(1);
shop.add(4);
shop.remove(1);
console.log(shop.current());
// → [{ coffeeId: 4, quantity: 1 }]
shop.undo();
console.log(shop.current());
// → [{ coffeeId: 1, quantity: 2 }, { coffeeId: 4, quantity: 1 }]
shop.undo();
shop.undo();
console.log(shop.current());
// → [{ coffeeId: 1, quantity: 1 }]

// Undo de más: se queda en el carrito vacío sin romper
shop.undo();
shop.undo();
shop.undo();
console.log(shop.current());
// → []

// Después de deshacer se puede seguir añadiendo
shop.add(7);
console.log(shop.current());
// → [{ coffeeId: 7, quantity: 1 }]

// Cada historial tiene su propio closure: no se pisan
console.log(history.current());
// → [{ coffeeId: 1, quantity: 1 }]
