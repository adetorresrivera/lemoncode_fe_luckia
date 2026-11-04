/// <reference types="vite/client" />

// Variables de entorno del cliente (O3). Sin esto, import.meta.env.VITE_API_BASE
// sería `any` (el índice genérico de vite/client). Declarar la interfaz la
// fusiona con la de Vite y la deja como string.
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
