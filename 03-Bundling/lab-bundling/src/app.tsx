import { useState } from "react";
import { coffees, type Coffee } from "./data";
import { API_BASE, SHOP_NAME, SHOW_OFFERS } from "./env.constants";
import coffeePhoto from "./assets/coffee.jpg";

export const App = () => {
  const [cart, setCart] = useState<Coffee[]>([]);

  return (
    <main>
      {SHOW_OFFERS && <p>Envío gratis este mes</p>}
      <h2>Cafés del mes de {SHOP_NAME}</h2>
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
      <p>
        <small>API: {API_BASE}</small>
      </p>
    </main>
  );
};
