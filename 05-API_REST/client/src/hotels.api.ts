// Cliente de la API de hoteles (hotels-server) con fetch.

// Sólo los campos que usa el front (el servidor manda unos 30).
export interface Hotel {
  id: string;
  name: string;
  city: string;
  lowRate: number;
  highRate: number;
}

export type NewHotel = Omit<Hotel, "id">;

// GET /api/cities devuelve { id, name } (docs/o1-curl.txt); en O4 sólo se
// cuentan, pero el id hace falta para pintarlas en una lista.
export interface City {
  id: string;
  name: string;
}

// URL base absoluta, de client/.env (O3): http://localhost:3000/api.
// Desde el build servido en localhost:3000 es el mismo origen; desde
// `npm run dev` (localhost:5173) es otro origen, y entra en juego CORS.
const API_BASE = import.meta.env.VITE_API_BASE;

// Las respuestas con éxito vienen envueltas en { data: ... }. `data` es
// opcional porque a veces falta: GET /api/hotels/999 responde 200 con {}.
type Envelope<T> = { data?: T };

// La señal para cancelar (O4) entra por options.signal: RequestInit ya la
// tiene, y el ...options de abajo la pasa a fetch tal cual. Si se aborta,
// fetch (o response.json(), si ya estaba leyendo el cuerpo) rechaza con un
// DOMException de nombre "AbortError", que sale de aquí sin tocar.
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const url = `${API_BASE}${path}`;
  const method = options.method ?? "GET";

  // Se parte de las cabeceras que lleguen en options y sólo se añaden las
  // que falten, para no pisarlas.
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) {
    // Sin esto el servidor responde 406 a todo (middleware.ts).
    headers.set("Accept", "application/json");
  }
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // fetch sólo lanza si no hay respuesta (error de red, CORS, abort).
  // Un 404 o un 500 llegan aquí como respuestas normales.
  const response = await fetch(url, { ...options, method, headers });

  if (!response.ok) {
    throw new Error(
      `${method} ${url} → ${response.status} ${response.statusText}`,
    );
  }

  // 204 No Content: no hay cuerpo y response.json() lanzaría SyntaxError.
  if (response.status === 204) {
    return undefined;
  }

  // response.json() devuelve any. Aquí TypeScript se fía del servidor sin
  // comprobar nada: si el cuerpo no tiene esta forma, nadie se entera hasta
  // que algo falle más adelante. Validarlo en ejecución es P5 (Zod).
  const body: Envelope<T> = await response.json();
  return body.data;
}

// Para las llamadas que siempre tienen que traer data.
function requireData<T>(data: T | undefined, what: string): T {
  if (data === undefined) {
    throw new Error(`${what}: la respuesta no trae data`);
  }
  return data;
}

// signal es opcional: las llamadas de O2 (getHotels()) siguen igual.
export async function getHotels(signal?: AbortSignal): Promise<Hotel[]> {
  const hotels = await request<Hotel[]>("/hotels", { signal });
  return requireData(hotels, `GET ${API_BASE}/hotels`);
}

export async function getCities(): Promise<City[]> {
  const cities = await request<City[]>("/cities");
  return requireData(cities, `GET ${API_BASE}/cities`);
}

// Sólo para el botón "Cargar con fallo" (O4): una ruta que no existe. Pasa
// por request como las demás, así que el 404 sale con el mismo error
// ("GET http://localhost:3000/api/nope → 404 Not Found"). Nunca resuelve con
// datos: el cuerpo del 404 es HTML de Express, y request lanza antes de
// intentar leerlo.
export async function getNope(): Promise<unknown> {
  return request<unknown>("/nope");
}

// El servidor no devuelve 404: un hotel que no existe es un 200 con {}, sin
// data (README, O1). request devuelve entonces undefined y aquí pasa a null.
export async function getHotel(id: string): Promise<Hotel | null> {
  const hotel = await request<Hotel>(`/hotels/${id}`);
  return hotel ?? null;
}

// Sin id: lo genera el servidor (un UUID) y viene en la respuesta (201).
export async function createHotel(hotel: NewHotel): Promise<Hotel> {
  const created = await request<Hotel>("/hotels", {
    method: "POST",
    body: JSON.stringify(hotel),
  });
  return requireData(created, `POST ${API_BASE}/hotels`);
}

export async function updateHotel(
  id: string,
  changes: Partial<NewHotel>,
): Promise<Hotel> {
  const updated = await request<Hotel>(`/hotels/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
  return requireData(updated, `PUT ${API_BASE}/hotels/${id}`);
}

// 204 sin cuerpo: request devuelve undefined y aquí no se usa.
export async function deleteHotel(id: string): Promise<void> {
  await request(`/hotels/${id}`, { method: "DELETE" });
}
