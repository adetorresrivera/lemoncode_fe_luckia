import type { ReactNode } from "react";

interface NotFoundMessageProps {
  title: string;
  // Lo que va debajo del título (normalmente, un enlace para volver).
  // Common no conoce las rutas: quien lo usa decide adónde se vuelve.
  children?: ReactNode;
}

export function NotFoundMessage({ title, children }: NotFoundMessageProps) {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  );
}
