import { createFileRoute } from "@tanstack/react-router";
import { parseCoffeeId } from "../../../core/coffees/model";
import { CoffeeDetailScene } from "../../../scenes/coffee-detail.scene";

export const Route = createFileRoute("/coffees/$coffeeId/")({
  component: CoffeeDetailRoute,
});

// La ruta sólo lee el parámetro (un string) y se lo pasa a la escena como id.
function CoffeeDetailRoute() {
  const { coffeeId } = Route.useParams();
  return <CoffeeDetailScene coffeeId={parseCoffeeId(coffeeId)} />;
}
