import React from 'react';
import type { Coffee } from './model';
import { getCoffees } from './coffee.api';
import { formatPrice } from './cart';
import { CoffeeCard } from './coffee-card';
import { useCart } from './use-cart';

export const CoffeeCatalog: React.FC = () => {
  const [coffees, setCoffees] = React.useState<Coffee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const { units, total, add, clear } = useCart(coffees);

  React.useEffect(() => {
    getCoffees()
      .then(setCoffees)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p role="alert">{error}</p>;

  const visible = coffees.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section>
      <h2>Cafés del mes</h2>
      <label htmlFor="filter">Buscar</label>
      <input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      {visible.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
        <ul>
          {visible.map((coffee) => (
            <CoffeeCard key={coffee.id} coffee={coffee} onAdd={add} />
          ))}
        </ul>
      )}
      <p>
        {units} bolsas · {formatPrice(total)}
      </p>
      <button onClick={clear} disabled={units === 0}>Vaciar carrito</button>
    </section>
  );
};
