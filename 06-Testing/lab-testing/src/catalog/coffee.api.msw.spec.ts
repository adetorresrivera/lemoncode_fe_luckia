import { http, HttpResponse } from 'msw';
import { getCoffees, url } from './coffee.api';
import { server } from './mocks/server';
import { coffees } from './test-data';

// El servidor sólo intercepta en este fichero: los specs con vi.spyOn no lo ven.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('getCoffees (MSW)', () => {
  describe('cuando la API responde 200', () => {
    it('debería devolver los cafés del campo data cuando la API responde 200', async () => {
      // Arrange: el handler por defecto (mocks/handlers.ts) responde { data: coffees }

      // Act
      const result = await getCoffees();

      // Assert
      expect(result).toEqual(coffees);
    });

    it('debería mandar la cabecera Accept: application/json cuando pide GET /api/coffees', async () => {
      // Arrange
      let accept: string | null = null;
      server.use(
        http.get(url, ({ request }) => {
          accept = request.headers.get('accept');
          return HttpResponse.json({ data: coffees });
        }),
      );

      // Act
      await getCoffees();

      // Assert
      expect(accept).toBe('application/json');
    });
  });

  describe('cuando la API responde con un error', () => {
    it.each([
      { status: 404, message: 'Catálogo no encontrado' },
      { status: 503, message: 'Servicio no disponible' },
      { status: 500, message: 'Error inesperado' },
    ])('debería rechazar con "$message" cuando la API responde $status', async ({ status, message }) => {
      // Arrange
      server.use(http.get(url, () => HttpResponse.json({ data: coffees }, { status })));

      // Act
      const result = getCoffees();

      // Assert
      await expect(result).rejects.toThrow(message);
    });
  });

  describe('cuando falla la red', () => {
    it('debería propagar el TypeError "fetch failed" de Node cuando la red falla', async () => {
      // Arrange
      server.use(http.get(url, () => HttpResponse.error()));

      // Act
      const result = getCoffees();

      // Assert
      await expect(result).rejects.toThrow(TypeError);
      await expect(result).rejects.toThrow('fetch failed');
    });
  });
});
