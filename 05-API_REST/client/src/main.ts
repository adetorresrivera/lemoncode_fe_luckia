import "./style.css";
import {
  createHotel,
  deleteHotel,
  getCities,
  getHotel,
  getHotels,
  getNope,
  updateHotel,
} from "./hotels.api.ts";

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function getElement<T extends HTMLElement>(selector: string, type: new () => T): T {
  const element = document.querySelector(selector);
  // instanceof en vez de `as`: si el id no existe o no es de ese tipo, se
  // dice aquí y no con un "Cannot read properties of null" más adelante.
  if (!(element instanceof type)) {
    throw new Error(`Falta ${selector} en index.html`);
  }
  return element;
}

const result = getElement("#result", HTMLPreElement);

// Lo mismo en la página (zona aria-live: el lector de pantalla lo anuncia) y
// en la consola.
function show(title: string, lines: string[]): void {
  result.textContent = [title, ...lines].join("\n");
  console.log(title, lines);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// La cancelación provocada por AbortController. fetch rechaza con un
// DOMException (no es un Error "normal": no hay que crear ninguna clase) y lo
// que lo distingue es el name.
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function elapsed(start: number): string {
  return `${(performance.now() - start).toFixed(1)} ms`;
}

// Cada botón: lanza la acción y, si falla, enseña el error. El listener no
// espera a la promesa; sin este catch, el error acabaría como
// "Uncaught (in promise)".
function onClick(selector: string, label: string, action: () => Promise<void>): void {
  getElement(selector, HTMLButtonElement).addEventListener("click", () => {
    action().catch((error: unknown) => {
      console.error(`${label}:`, error);
      show(`${label}: error`, [errorMessage(error)]);
    });
  });
}

// ---------------------------------------------------------------------------
// O2 · Probar CRUD (sólo consola)
// ---------------------------------------------------------------------------

async function testCrud(): Promise<void> {
  console.log("1", (await getHotels()).length);
  const created = await createHotel({ name: "Hotel Tueste", city: "Seattle", lowRate: 90, highRate: 120 });
  console.log("2", created.name, created.id);
  console.log("3", (await getHotel(created.id))?.name);
  console.log("4", (await updateHotel(created.id, { lowRate: 95 })).lowRate);
  await deleteHotel(created.id);
  console.log("5", await getHotel(created.id));
  console.log("6", (await getHotels()).length);
}

// ---------------------------------------------------------------------------
// O4 · a) Cargar todo: las dos a la vez
// ---------------------------------------------------------------------------

async function loadAll(): Promise<void> {
  show("Cargar todo (Promise.all)", ["Cargando…"]);
  const start = performance.now();
  // Las dos peticiones salen aquí mismo, al construir el array: getHotels()
  // y getCities() empiezan el fetch al llamarlas. Promise.all sólo espera a
  // que acaben las dos (o a que falle la primera).
  const [hotels, cities] = await Promise.all([getHotels(), getCities()]);
  show("Cargar todo (Promise.all)", [
    `${hotels.length} hoteles, ${cities.length} ciudades`,
    `Tiempo: ${elapsed(start)}`,
  ]);
}

// ---------------------------------------------------------------------------
// O4 · b) Cargar en serie: la segunda espera a la primera
// ---------------------------------------------------------------------------

async function loadSerial(): Promise<void> {
  show("Cargar en serie (await + await)", ["Cargando…"]);
  const start = performance.now();
  const hotels = await getHotels();
  // getCities() no se llama hasta que la línea anterior ha terminado.
  const cities = await getCities();
  show("Cargar en serie (await + await)", [
    `${hotels.length} hoteles, ${cities.length} ciudades`,
    `Tiempo: ${elapsed(start)}`,
  ]);
}

// ---------------------------------------------------------------------------
// O4 · c) Cargar con fallo: Promise.all y después Promise.allSettled
// ---------------------------------------------------------------------------

// Una línea por resultado de allSettled: el valor resumido o el motivo.
function describe<T>(
  label: string,
  settled: PromiseSettledResult<T>,
  summary: (value: T) => string,
): string {
  return settled.status === "fulfilled"
    ? `✔ ${label}: ${summary(settled.value)}`
    : `✘ ${label}: ${errorMessage(settled.reason)}`;
}

async function loadFailing(): Promise<void> {
  const lines: string[] = [];
  show("Cargar con fallo", ["Cargando…"]);

  // 1) Promise.all: rechaza en cuanto una rechaza, con el motivo de esa. Los
  // datos de las que sí han ido bien se pierden (las peticiones no se
  // cancelan: en Network acaban con 200, pero aquí no llegan).
  lines.push("1) Promise.all");
  try {
    const [hotels, cities] = await Promise.all([getHotels(), getCities(), getNope()]);
    lines.push(`   ${hotels.length} hoteles, ${cities.length} ciudades`);
  } catch (error) {
    lines.push(`   → catch: ${errorMessage(error)}`);
  }

  // 2) Promise.allSettled: espera a las tres y nunca rechaza; cada una
  // trae su status. Son tres peticiones nuevas: el array de arriba ya se
  // gastó (sus promesas ya están resueltas o rechazadas).
  lines.push("2) Promise.allSettled");
  const [hotels, cities, nope] = await Promise.allSettled([getHotels(), getCities(), getNope()]);
  lines.push(
    `   ${describe("hoteles", hotels, (value) => `${value.length}`)}`,
    `   ${describe("ciudades", cities, (value) => `${value.length}`)}`,
    `   ${describe("/api/nope", nope, () => "ok")}`,
  );

  show("Cargar con fallo", lines);
}

// ---------------------------------------------------------------------------
// O4 · d) Recargar: cada clic cancela el anterior
// ---------------------------------------------------------------------------

// El controlador de la petición en curso (null si no hay ninguna). Vive fuera
// de la función porque cada clic tiene que poder abortar la del clic anterior.
let reloadController: AbortController | null = null;
let reloadCount = 0;

async function reload(): Promise<void> {
  reloadController?.abort();
  const controller = new AbortController();
  reloadController = controller;
  reloadCount += 1;
  const attempt = reloadCount;

  show(`Recargar #${attempt}`, ["Cargando…"]);
  const start = performance.now();
  try {
    const hotels = await getHotels(controller.signal);
    show(`Recargar #${attempt}`, [`${hotels.length} hoteles`, `Tiempo: ${elapsed(start)}`]);
  } catch (error) {
    if (isAbortError(error)) {
      // La hemos cancelado nosotros: no es un error y no se pinta.
      console.info(`Recargar #${attempt}: cancelada por un clic posterior`);
      return;
    }
    throw error; // los errores de verdad, a onClick
  } finally {
    // Si ya hay otra en curso, el controlador es el suyo: no se toca.
    if (reloadController === controller) {
      reloadController = null;
    }
  }
}

// ---------------------------------------------------------------------------

onClick("#test-crud", "Probar CRUD", testCrud);
onClick("#load-all", "Cargar todo", loadAll);
onClick("#load-serial", "Cargar en serie", loadSerial);
onClick("#load-failing", "Cargar con fallo", loadFailing);
onClick("#reload", "Recargar", reload);
