import type { CartItem, Coffee } from './model';

export const formatPrice = (price: number): string => `${price.toFixed(2)} €`;

export const finalPrice = (coffee: Coffee): number =>
  coffee.price * (1 - (coffee.discount ?? 0));

export const addToCart = (cart: CartItem[], coffeeId: number): CartItem[] =>
  cart.some((item) => item.coffeeId === coffeeId)
    ? cart.map((item) =>
        item.coffeeId === coffeeId ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...cart, { coffeeId, quantity: 1 }];

export const removeFromCart = (cart: CartItem[], coffeeId: number): CartItem[] =>
  cart.filter((item) => item.coffeeId !== coffeeId);

export const cartTotal = (cart: CartItem[], coffees: Coffee[]): number =>
  cart.reduce((total, item) => {
    const coffee = coffees.find((c) => c.id === item.coffeeId);
    return coffee ? total + finalPrice(coffee) * item.quantity : total;
  }, 0);
