import type { Application, Company, Contact, CvVersion } from "./tfm-types";

// Las mismas 10 candidaturas que la tabla del lab 1 (01-Maquetacion/postula/app/candidaturas.html).

export const companies: Company[] = [
  { id: 1, name: "Brisa Software", city: "Valencia" },
  { id: 2, name: "Kora Health", website: "https://kora.example" },
  { id: 3, name: "Talaia Studio", city: "Bilbao" },
  { id: 4, name: "Nube Alta" },
  { id: 5, name: "Mareta Pagos", city: "Madrid" },
  { id: 6, name: "Ondina Games" },
  { id: 7, name: "Garnacha Tech", city: "Zaragoza" },
  { id: 8, name: "Faro Logística", city: "A Coruña" },
  { id: 9, name: "Nimbo Cloud" },
  { id: 10, name: "Lince Data", city: "Sevilla" },
];

export const contacts: Contact[] = [
  { id: 1, companyId: 1, name: "Laura M.", role: "RR. HH.", email: "laura@brisa.example" },
  { id: 2, companyId: 3, name: "Iker S.", role: "Tech lead" },
  { id: 3, companyId: 5, name: "Paula R.", role: "RR. HH.", phone: "600 000 000" },
  { id: 4, companyId: 6, name: "Jorge P." },
  { id: 5, companyId: 8, name: "Marta G.", role: "Engineering manager" },
  { id: 6, companyId: 10, name: "Sergio T." },
];

export const cvVersions: CvVersion[] = [
  { id: 1, name: "CV frontend v3", createdAt: "2026-09-01" },
  { id: 2, name: "CV React v2", createdAt: "2026-09-10" },
  { id: 3, name: "CV generalista v1", createdAt: "2026-08-20" },
];

export const applications: Application[] = [
  {
    id: 1,
    companyId: 1,
    position: "Frontend Developer",
    status: "Entrevista",
    updatedAt: "2026-10-19",
    cvVersionId: 1,
    contactId: 1,
    nextAction: { label: "Prueba técnica", dueDate: "2026-10-22" },
  },
  {
    id: 2,
    companyId: 2,
    position: "Desarrolladora React",
    status: "Enviada",
    updatedAt: "2026-10-17",
    cvVersionId: 2,
    nextAction: { label: "Escribir para seguimiento", dueDate: "2026-10-28" },
  },
  {
    id: 3,
    companyId: 3,
    position: "Junior Web Developer",
    status: "Oferta",
    updatedAt: "2026-10-14",
    cvVersionId: 1,
    contactId: 2,
  },
  {
    id: 4,
    companyId: 4,
    position: "Maquetador/a HTML y CSS",
    status: "Guardada",
    updatedAt: "2026-10-12",
  },
  {
    id: 5,
    companyId: 5,
    position: "Frontend Engineer",
    status: "Entrevista",
    updatedAt: "2026-10-11",
    cvVersionId: 1,
    contactId: 3,
    nextAction: { label: "Llamada con RR. HH.", dueDate: "2026-10-26" },
  },
  {
    id: 6,
    companyId: 6,
    position: "Desarrollador/a Vue",
    status: "Descartada",
    updatedAt: "2026-10-08",
    cvVersionId: 3,
    contactId: 4,
    notes: "Buscaban perfil con más experiencia en Nuxt.",
  },
  {
    id: 7,
    companyId: 7,
    position: "Web Developer",
    status: "Enviada",
    updatedAt: "2026-10-05",
    cvVersionId: 3,
  },
  {
    id: 8,
    companyId: 8,
    position: "Desarrollador/a frontend",
    status: "Entrevista",
    updatedAt: "2026-10-03",
    cvVersionId: 2,
    contactId: 5,
    nextAction: { label: "Entrevista técnica", dueDate: "2026-11-03" },
  },
  {
    id: 9,
    companyId: 9,
    position: "Frontend Developer Jr.",
    status: "Enviada",
    updatedAt: "2026-09-30",
    cvVersionId: 3,
    // Ya vencida: nextSteps la saca la primera, marcada como atrasada.
    nextAction: { label: "Escribir para seguimiento", dueDate: "2026-10-15" },
  },
  {
    id: 10,
    companyId: 10,
    position: "Desarrollador/a Angular",
    status: "Descartada",
    updatedAt: "2026-09-26",
    cvVersionId: 1,
    contactId: 6,
  },
];
