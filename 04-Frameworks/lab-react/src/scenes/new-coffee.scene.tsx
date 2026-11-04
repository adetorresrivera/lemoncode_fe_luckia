import { Link, useNavigate } from "@tanstack/react-router";
import type { Coffee } from "../core/coffees/model";
import { CoffeeFormContainer } from "../pods/edicion";

export function NewCoffeeScene() {
  const navigate = useNavigate();

  // La escena es quien sabe adónde ir después de guardar: al detalle del café nuevo.
  async function goToDetail(coffee: Coffee): Promise<void> {
    await navigate({ to: "/coffees/$coffeeId", params: { coffeeId: String(coffee.id) } });
  }

  return (
    <>
      <p>
        <Link to="/coffees">← Volver al catálogo</Link>
      </p>
      <h1>Añadir café</h1>
      <CoffeeFormContainer onSaved={goToDetail} />
    </>
  );
}
