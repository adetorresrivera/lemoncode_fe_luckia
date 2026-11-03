import { useState } from "react";
import { coffees, type Coffee } from "./data";
import coffeePhoto from "./assets/coffee.jpg";

export const App = () => {
  const [cart, setCart] = useState<Coffee[]>([]);

  return (
    <main>
      <h2>Cafés del mes</h2>
      <img src={coffeePhoto} alt="" />
      <ul>
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            <h3>{coffee.name}</h3>
            <p>{coffee.price.toFixed(2)} €</p>
            <button onClick={() => setCart((prev) => [...prev, coffee])}>Añadir</button>
          </li>
        ))}
      </ul>
      <p>Bolsas en el carrito: {cart.length}</p>
    </main>
  );
};
