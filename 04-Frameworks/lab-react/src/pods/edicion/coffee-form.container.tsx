import type { Coffee, CoffeeInput } from "../../core/coffees/model";
import { toCoffeeInput } from "../../core/coffees/model";
import { createCoffee, updateCoffee } from "../../core/coffees/api";
import { useCoffee } from "../../core/coffees/hooks";
import { ErrorMessage, LoadingMessage, NotFoundMessage } from "../../common/components";
import { CoffeeForm } from "./coffee-form.component";

export interface CoffeeFormContainerProps {
  // Sin id es un alta; con id, la edición de ese café (NaN si la URL no traía un id).
  coffeeId?: number;
  // Qué hacer con el café ya guardado (con su id). El pod no sabe de rutas:
  // la escena decide adónde se va. Se espera a que termine para que el botón
  // siga en "Guardando…" hasta haber navegado.
  onSaved: (coffee: Coffee) => Promise<void>;
}

export function CoffeeFormContainer({ coffeeId, onSaved }: CoffeeFormContainerProps) {
  // El hook va arriba, antes de cualquier return. En el alta (sin id) no carga nada.
  const { coffee, loading, error } = useCoffee(coffeeId);

  async function handleSave(input: CoffeeInput): Promise<void> {
    const saved =
      coffeeId === undefined ? await createCoffee(input) : await updateCoffee(coffeeId, input);
    await onSaved(saved);
  }

  if (coffeeId === undefined) {
    return (
      <>
        <h1>Añadir café</h1>
        <CoffeeForm onSave={handleSave} />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <h1>Editar café</h1>
        <LoadingMessage />
      </>
    );
  }

  if (error !== null) {
    return (
      <>
        <h1>Editar café</h1>
        <ErrorMessage message={error} />
      </>
    );
  }

  if (coffee === undefined) {
    return <NotFoundMessage title="Café no encontrado" />;
  }

  // El formulario se monta cuando el café ya ha llegado: useForm lee
  // defaultValues al montarse, así que los campos salen ya rellenos.
  return (
    <>
      <h1>Editar café</h1>
      <CoffeeForm initialValues={toCoffeeInput(coffee)} onSave={handleSave} />
    </>
  );
}
