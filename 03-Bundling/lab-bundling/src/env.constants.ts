// Único sitio que lee import.meta.env. El resto del código importa de aquí.
export const SHOP_NAME = import.meta.env.VITE_SHOP_NAME;
export const API_BASE = import.meta.env.VITE_API_BASE;
// Las variables de entorno siempre llegan como texto: "false" sería truthy.
export const SHOW_OFFERS = import.meta.env.VITE_SHOW_OFFERS === "true";
