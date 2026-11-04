import { Link } from "@tanstack/react-router";
import type { Coffee } from "../../core/coffees/model";
import { roastLabels } from "../../core/coffees/model";
import { BackToCatalogLink } from "./components/back-to-catalog-link";

interface CoffeeDetailProps {
  coffee: Coffee;
}

export function CoffeeDetail({ coffee }: CoffeeDetailProps) {
  return (
    <>
      <BackToCatalogLink />
      <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1>{coffee.name}</h1>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          <dt className="font-semibold">Origen</dt>
          <dd>{coffee.origin}</dd>
          <dt className="font-semibold">Tueste</dt>
          <dd>{roastLabels[coffee.roast]}</dd>
          <dt className="font-semibold">Precio</dt>
          <dd>{coffee.price.toFixed(2) + " €"}</dd>
          <dt className="font-semibold">Notas de cata</dt>
          <dd>{coffee.notes}</dd>
        </dl>
        {/* Sólo un enlace a la ruta de edición: este pod no importa el formulario. */}
        <p>
          <Link to="/coffees/$coffeeId/edit" params={{ coffeeId: String(coffee.id) }}>
            Editar café
          </Link>
        </p>
      </article>
    </>
  );
}
