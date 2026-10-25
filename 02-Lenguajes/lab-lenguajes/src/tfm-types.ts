// Modelo de datos de Postula (TFM). Las relaciones van por id, como vendrían
// de una API: una candidatura guarda `companyId`, no la empresa entera.

// Los 5 estados del kanban, en el orden de las columnas.
export type ApplicationStatus = "Guardada" | "Enviada" | "Entrevista" | "Oferta" | "Descartada";

// Fecha ISO `AAAA-MM-DD`. La plantilla rechaza "19/10/2026" en compilación;
// no impide "2026-1-5", así que los datos se escriben siempre con dos dígitos
// (de eso depende que se puedan comparar como texto).
export type IsoDate = `${number}-${number}-${number}`;

export interface Company {
  readonly id: number;
  name: string;
  website?: string;
  city?: string;
}

export interface Contact {
  readonly id: number;
  companyId: number;
  name: string;
  role?: string; // "RR. HH.", "Tech lead"…
  email?: string;
  phone?: string;
}

export interface CvVersion {
  readonly id: number;
  name: string; // "CV frontend v3"
  createdAt: IsoDate;
}

export interface NextAction {
  label: string; // "Prueba técnica"
  dueDate: IsoDate;
}

export interface Application {
  readonly id: number;
  companyId: number;
  position: string;
  status: ApplicationStatus;
  updatedAt: IsoDate;
  cvVersionId?: number; // sin CV = todavía no se ha enviado
  contactId?: number;
  nextAction?: NextAction;
  notes?: string;
}

// Crear: todo menos el id, que lo pone quien guarda.
export type NewApplication = Omit<Application, "id">;

// Editar: cualquier subconjunto de lo anterior; `id` sigue sin poder cambiarse.
export type ApplicationUpdate = Partial<NewApplication>;
