import React from 'react';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { url } from './coffee.api';
import { CoffeeCatalog } from './coffee-catalog';
import { server } from './mocks/server';

// Sin vi.spyOn: getCoffees y fetch se ejecutan de verdad y MSW contesta.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CoffeeCatalog (MSW)', () => {
  describe('carga', () => {
    it('debería mostrar "Cargando…" cuando la API todavía no ha respondido', async () => {
      // Arrange: el handler por defecto responde { data: coffees }

      // Act
      render(<CoffeeCatalog />);

      // Assert
      expect(screen.getByText('Cargando…')).toBeInTheDocument();
      // Esperamos a que termine la carga para que no haya setState fuera de act.
      await screen.findAllByRole('listitem');
    });

    it('debería mostrar los 3 cafés y quitar "Cargando…" cuando la API responde 200', async () => {
      // Arrange: el handler por defecto responde { data: coffees }

      // Act
      render(<CoffeeCatalog />);
      const items = await screen.findAllByRole('listitem');

      // Assert
      expect(items).toHaveLength(3);
      expect(screen.queryByText('Cargando…')).not.toBeInTheDocument();
    });
  });

  describe('error', () => {
    it('debería mostrar la alerta "Servicio no disponible" cuando la API responde 503', async () => {
      // Arrange
      server.use(http.get(url, () => HttpResponse.json(null, { status: 503 })));

      // Act
      render(<CoffeeCatalog />);
      const alert = await screen.findByRole('alert');

      // Assert
      expect(alert).toHaveTextContent('Servicio no disponible');
    });

    it('debería mostrar una alerta con "fetch failed" cuando la red falla', async () => {
      // Arrange
      server.use(http.get(url, () => HttpResponse.error()));

      // Act
      render(<CoffeeCatalog />);
      const alert = await screen.findByRole('alert');

      // Assert
      expect(alert).toHaveTextContent('fetch failed');
    });
  });
});
