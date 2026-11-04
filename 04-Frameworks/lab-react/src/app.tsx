import type { Coffee } from "./model";
import { CoffeeCard } from "./coffee-card";

const coffees: Coffee[] = [
  {
    id: 1,
    name: "Etiopía Yirgacheffe",
    origin: "Etiopía",
    roast: "light",
    price: 14.9,
    notes: "Floral, bergamota y té negro.",
  },
  {
    id: 2,
    name: "Colombia Huila",
    origin: "Colombia",
    roast: "medium",
    price: 12.9,
    notes: "Caramelo y manzana roja.",
  },
  {
    id: 3,
    name: "Kenia AA",
    origin: "Kenia",
    roast: "light",
    price: 15.5,
    notes: "Frutos rojos y pomelo.",
  },
  {
    "id": 4,
    "name": "Brasil Cerrado",
    "origin": "Brasil",
    "roast": "dark",
    "price": 10.5,
    "notes": "Chocolate y avellana."
  },
];

export function App() {
  const count = coffees.length;
  const summary = `${count} ${count === 1 ? "café" : "cafés"} este mes`;

  return (
    <main>
      <h1>Tueste</h1>
      <p>{summary}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            <CoffeeCard coffee={coffee} />
          </li>
        ))}
      </ul>
    </main>
  );
}
