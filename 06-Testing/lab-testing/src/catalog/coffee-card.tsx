import React from 'react';
import type { Coffee } from './model';
import { finalPrice, formatPrice } from './cart';

interface Props {
  coffee: Coffee;
  onAdd: (coffee: Coffee) => void;
}

export const CoffeeCard: React.FC<Props> = ({ coffee, onAdd }) => (
  <li>
    <h3>{coffee.name}</h3>
    <p>{coffee.origin}</p>
    <p>{formatPrice(finalPrice(coffee))}</p>
    {coffee.discount ? <p>-{coffee.discount * 100} %</p> : null}
    <button onClick={() => onAdd(coffee)}>Añadir {coffee.name} al carrito</button>
  </li>
);
