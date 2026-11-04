import { createFileRoute, Link } from "@tanstack/react-router";
import { roastLabels } from "../../model";
import { useCoffee } from "../../use-coffee";

export const Route = createFileRoute("/coffees/$coffeeId")({
  component: CoffeeDetailPage,
});

// El parámetro de la URL siempre es un string: sólo "1", "2"… son ids válidos.
// Con Number() a secas, "" daría 0, " 4" daría 4 y "0x4" también 4.
function parseCoffeeId(value: string): number {
  return /^[1-9]\d*$/.test(value) ? Number(value) : Number.NaN;
}

function CoffeeDetailPage() {
  const { coffeeId } = Route.useParams();
  const { coffee, loading, error } = useCoffee(parseCoffeeId(coffeeId));

  const backLink = (
    <p>
      <Link to="/coffees">← Volver al catálogo</Link>
    </p>
  );

  if (loading) {
    return <p role="status">Cargando…</p>;
  }

  if (error !== null) {
    return (
      <>
        <h1>Detalle del café</h1>
        <p role="alert">{error}</p>
        {backLink}
      </>
    );
  }

  if (coffee === undefined) {
    return (
      <>
        <h1>Café no encontrado</h1>
        {backLink}
      </>
    );
  }

  return (
    <>
      {backLink}
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
      </article>
    </>
  );
}
