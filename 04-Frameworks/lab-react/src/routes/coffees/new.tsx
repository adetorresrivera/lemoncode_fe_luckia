import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { CoffeeInput } from "../../model";
import { saveCoffee } from "../../api";
import { CoffeeForm } from "../../coffee-form";

export const Route = createFileRoute("/coffees/new")({
  component: NewCoffeePage,
});

function NewCoffeePage() {
  const navigate = useNavigate();

  async function handleSave(input: CoffeeInput): Promise<void> {
    const coffee = await saveCoffee(input);
    await navigate({ to: "/coffees/$coffeeId", params: { coffeeId: String(coffee.id) } });
  }

  return (
    <>
      <p>
        <Link to="/coffees">← Volver al catálogo</Link>
      </p>
      <h1>Añadir café</h1>
      <CoffeeForm onSave={handleSave} />
    </>
  );
}
