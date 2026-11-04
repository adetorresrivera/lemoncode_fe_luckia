import { createRootRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "../layouts/app-layout";
import { NotFoundMessage } from "../common/components";

export const Route = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <NotFoundMessage title="Página no encontrada">
      <p>
        <Link to="/coffees">Volver al catálogo</Link>
      </p>
    </NotFoundMessage>
  );
}
