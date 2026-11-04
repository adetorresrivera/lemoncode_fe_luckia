import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../../routeTree.gen";

export const router = createRouter({ routeTree });

// Registra el router en los tipos: así Link, useNavigate y useParams saben
// qué rutas existen y qué parámetros lleva cada una.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
