import { http, HttpResponse } from 'msw';
import { url } from '../coffee.api';
import { coffees } from '../test-data';

// Ruta relativa: MSW la resuelve contra location.origin (en jsdom,
// http://localhost:3000), igual que hace fetch con '/api/coffees'.
export const handlers = [http.get(url, () => HttpResponse.json({ data: coffees }))];
