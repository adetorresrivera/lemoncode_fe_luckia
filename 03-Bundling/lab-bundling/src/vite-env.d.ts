/// <reference types="vite/client" />

interface ViteTypeOptions {
  // Con esta clave, ImportMetaEnv deja de aceptar claves desconocidas:
  // import.meta.env.VITE_SHOP_NAM es un error de tipos y no un string.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_SHOP_NAME: string;
  readonly VITE_API_BASE: string;
  readonly VITE_SHOW_OFFERS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
