import { Link, useNavigate } from "@tanstack/react-router";
import type { Coffee } from "../core/coffees/model";
import { CoffeeFormContainer } from "../pods/edicion";

interface EditCoffeeSceneProps {
  coffeeId: number;
}

export function EditCoffeeScene({ coffeeId }: EditCoffeeSceneProps) {
  const navigate = useNavigate();

  // La escena decide adónde ir después de guardar: al detalle, que vuelve a
  // pedir el café y enseña ya el precio nuevo.
  async function goToDetail(coffee: Coffee): Promise<void> {
    await navigate({ to: "/coffees/$coffeeId", params: { coffeeId: String(coffee.id) } });
  }

  return (
    <>
      <p>
        <Link to="/coffees">← Volver al catálogo</Link>
      </p>
      <CoffeeFormContainer coffeeId={coffeeId} onSaved={goToDetail} />
    </>
  );
}
