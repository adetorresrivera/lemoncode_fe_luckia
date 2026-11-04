import type { Coffee, CoffeeInput } from "../../core/coffees/model";
import { saveCoffee } from "../../core/coffees/api";
import { CoffeeForm } from "./coffee-form.component";

export interface CoffeeFormContainerProps {
  // Qué hacer con el café ya guardado (con su id). El pod no sabe de rutas:
  // la escena decide adónde se va. Se espera a que termine para que el botón
  // siga en "Guardando…" hasta haber navegado, como en O6.
  onSaved: (coffee: Coffee) => Promise<void>;
}

export function CoffeeFormContainer({ onSaved }: CoffeeFormContainerProps) {
  async function handleSave(input: CoffeeInput): Promise<void> {
    const coffee = await saveCoffee(input);
    await onSaved(coffee);
  }

  return <CoffeeForm onSave={handleSave} />;
}
