import React from 'react';
import type { CartItem, Coffee } from './model';
import { addToCart, cartTotal, removeFromCart } from './cart';

export const useCart = (coffees: Coffee[]) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const add = (coffee: Coffee) => setCart((previous) => addToCart(previous, coffee.id));
  const remove = (coffeeId: number) => setCart((previous) => removeFromCart(previous, coffeeId));
  const clear = () => setCart([]);

  const units = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartTotal(cart, coffees);

  return { cart, units, total, add, remove, clear };
};
