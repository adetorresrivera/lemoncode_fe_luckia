import { applications, companies, cvVersions } from "./tfm-data";
import type { Application, ApplicationStatus, CvVersion, IsoDate, NextAction } from "./tfm-types";

// 1 · Cuántas candidaturas hay en cada columna del kanban. Igual que
// `countByRoast` (O9): el acumulador arranca con las 5 claves a 0, así que lo
// inferido encaja con `Record<ApplicationStatus, number>` sin `as`. Si mañana
// se añade un estado a la unión, este objeto deja de compilar hasta añadirlo.
export const countByStatus = (list: readonly Application[]): Record<ApplicationStatus, number> =>
  list.reduce(
    (counts, application) => ({ ...counts, [application.status]: counts[application.status] + 1 }),
    { Guardada: 0, Enviada: 0, Entrevista: 0, Oferta: 0, Descartada: 0 },
  );

// 2 · Entrevistas por versión de CV. El estado es el actual, no el historial:
// "Oferta" cuenta porque implica haber pasado por entrevista; "Descartada" no,
// porque no sabemos en qué fase se descartó.
const INTERVIEW_STATUSES: readonly ApplicationStatus[] = ["Entrevista", "Oferta"];

export interface CvStats {
  cv: CvVersion;
  sent: number;
  interviews: number;
  rate: number; // 0…1
}

// Se recorre `cvVersions` (y no las candidaturas) para que un CV sin envíos
// salga con 0 en vez de desaparecer. `cv` es la misma referencia que hay en
// la lista recibida: no se copia.
export const interviewRateByCv = (
  list: readonly Application[],
  cvs: readonly CvVersion[],
): CvStats[] =>
  cvs
    .map((cv) => {
      const sent = list.filter((application) => application.cvVersionId === cv.id);
      const interviews = sent.filter((application) => INTERVIEW_STATUSES.includes(application.status)).length;
      return { cv, sent: sent.length, interviews, rate: sent.length === 0 ? 0 : interviews / sent.length };
    })
    .toSorted((a, b) => b.rate - a.rate);

// 3 · Próximos pasos. `filter` con una función normal devuelve `Application[]`
// y dentro de `toSorted` TypeScript seguiría viendo `nextAction` como posible
// `undefined`. El predicado `application is ScheduledApplication` le dice a
// `filter` qué tipo sale; no es un `as`, pero TypeScript se fía de nosotros:
// si la comprobación estuviera mal, mentiría igual.
export type ScheduledApplication = Application & { nextAction: NextAction };

const hasNextAction = (application: Application): application is ScheduledApplication =>
  application.nextAction !== undefined;

export type NextStep = ScheduledApplication & { overdue: boolean };

// `today` llega por parámetro: con `new Date()` dentro la función dejaría de
// ser pura (el mismo input daría otro resultado mañana). Las fechas ISO con
// dos dígitos se ordenan bien como texto, sin pasar por `Date`.
// Las vencidas no se descartan: el orden ascendente ya las pone primero, que
// es lo urgente. El `map` va después de `slice` para copiar sólo las que salen.
export const nextSteps = (
  list: readonly Application[],
  today: IsoDate,
  limit: number = 3,
): NextStep[] =>
  list
    .filter(hasNextAction)
    .toSorted((a, b) => a.nextAction.dueDate.localeCompare(b.nextAction.dueDate))
    .slice(0, limit)
    .map((application) => ({ ...application, overdue: application.nextAction.dueDate < today }));

// Sólo para pintar la salida: el nombre de la empresa a partir del id.
const companyName = (id: number): string => companies.find((company) => company.id === id)?.name ?? "—";

console.log(countByStatus(applications));
// → { Guardada: 1, Enviada: 3, Entrevista: 3, Oferta: 1, Descartada: 2 }

console.log(
  interviewRateByCv(applications, cvVersions).map(
    ({ cv, sent, interviews, rate }) => `${cv.name}: ${interviews} de ${sent} (${Math.round(rate * 100)} %)`,
  ),
);
// → ["CV frontend v3: 3 de 4 (75 %)", "CV React v2: 1 de 2 (50 %)", "CV generalista v1: 0 de 3 (0 %)"]

console.log(
  nextSteps(applications, "2026-10-21").map(
    ({ companyId, nextAction, overdue }) =>
      `${overdue ? "ATRASADA " : ""}${nextAction.dueDate} · ${nextAction.label} · ${companyName(companyId)}`,
  ),
);
// → ["ATRASADA 2026-10-15 · Escribir para seguimiento · Nimbo Cloud",
//    "2026-10-22 · Prueba técnica · Brisa Software",
//    "2026-10-26 · Llamada con RR. HH. · Mareta Pagos"]

// El spread hace una copia superficial: la candidatura es un objeto nuevo,
// pero su `nextAction` es el mismo objeto que en los datos
const [, brisa] = nextSteps(applications, "2026-10-21");
console.log(brisa === applications[0], brisa.nextAction === applications[0].nextAction);
// → false true

// El original no se ha reordenado
console.log(applications.map((application) => application.id));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// nextSteps(applications, "21/10/2026");
// error TS2345: Argument of type '"21/10/2026"' is not assignable to parameter of type '`${number}-${number}-${number}`'.
