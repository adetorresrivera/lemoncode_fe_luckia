import { Link } from "@tanstack/react-router";

export function BackToCatalogLink() {
  return (
    <p>
      <Link to="/coffees">← Volver al catálogo</Link>
    </p>
  );
}
