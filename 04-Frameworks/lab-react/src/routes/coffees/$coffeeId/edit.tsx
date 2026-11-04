import { createFileRoute } from "@tanstack/react-router";
import { parseCoffeeId } from "../../../core/coffees/model";
import { EditCoffeeScene } from "../../../scenes/edit-coffee.scene";

export const Route = createFileRoute("/coffees/$coffeeId/edit")({
  component: EditCoffeeRoute,
});

// La ruta sólo lee el parámetro (un string) y se lo pasa a la escena como id.
function EditCoffeeRoute() {
  const { coffeeId } = Route.useParams();
  return <EditCoffeeScene coffeeId={parseCoffeeId(coffeeId)} />;
}
