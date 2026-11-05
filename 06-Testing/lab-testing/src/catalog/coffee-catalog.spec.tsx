import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as api from './coffee.api';
import { CoffeeCatalog } from './coffee-catalog';
import { coffees } from './test-data';

describe('CoffeeCatalog', () => {
  describe('carga', () => {
    it('debería mostrar "Cargando…" cuando getCoffees todavía no ha respondido', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);

      // Act
      render(<CoffeeCatalog />);

      // Assert
      expect(screen.getByText('Cargando…')).toBeInTheDocument();
      // La promesa se resuelve antes del cleanup: sin esta espera, setCoffees y
      // setLoading ocurren fuera de act (docs/o5-sin-esperar-carga.txt).
      await screen.findAllByRole('listitem');
    });

    it('debería mostrar los 3 cafés y quitar "Cargando…" cuando getCoffees resuelve', async () => {
      // Arrange
      const getCoffees = vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);

      // Act
      render(<CoffeeCatalog />);
      const items = await screen.findAllByRole('listitem');

      // Assert
      expect(items).toHaveLength(3);
      expect(screen.queryByText('Cargando…')).not.toBeInTheDocument();
      expect(getCoffees).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('debería mostrar una alerta con el mensaje del error cuando getCoffees rechaza', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockRejectedValue(new Error('Servicio no disponible'));

      // Act
      render(<CoffeeCatalog />);
      const alert = await screen.findByRole('alert');

      // Assert
      expect(alert).toHaveTextContent('Servicio no disponible');
    });
  });

  describe('buscador', () => {
    it('debería mostrar sólo Brasil Cerrado cuando se escribe "bra" en Buscar', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
      const user = userEvent.setup();
      render(<CoffeeCatalog />);
      const search = await screen.findByLabelText('Buscar');

      // Act
      await user.type(search, 'bra');

      // Assert
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(1);
      expect(within(items[0]).getByRole('heading', { name: 'Brasil Cerrado' })).toBeInTheDocument();
    });

    it('debería mostrar "Sin resultados" y ningún café cuando el texto no coincide con ninguno', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
      const user = userEvent.setup();
      render(<CoffeeCatalog />);
      const search = await screen.findByLabelText('Buscar');
      await user.type(search, 'bra');

      // Act
      await user.clear(search);
      await user.type(search, 'zzz');

      // Assert
      expect(screen.getByText('Sin resultados')).toBeInTheDocument();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('debería encontrar Brasil Cerrado cuando se escribe "BRA" en mayúsculas', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
      const user = userEvent.setup();
      render(<CoffeeCatalog />);
      const search = await screen.findByLabelText('Buscar');

      // Act
      await user.type(search, 'BRA');

      // Assert
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(1);
      expect(within(items[0]).getByRole('heading', { name: 'Brasil Cerrado' })).toBeInTheDocument();
    });
  });

  describe('carrito (integración)', () => {
    it('debería tener "Vaciar carrito" desactivado cuando el carrito está vacío', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);

      // Act
      render(<CoffeeCatalog />);
      const clearButton = await screen.findByRole('button', { name: 'Vaciar carrito' });

      // Assert
      expect(clearButton).toBeDisabled();
    });

    it('debería mostrar "2 bolsas · 23.91 €" y activar "Vaciar carrito" cuando se añaden Etiopía y Brasil', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
      const user = userEvent.setup();
      render(<CoffeeCatalog />);
      const addEthiopia = await screen.findByRole('button', {
        name: 'Añadir Etiopía Yirgacheffe al carrito',
      });

      // Act
      await user.click(addEthiopia);
      await user.click(screen.getByRole('button', { name: 'Añadir Brasil Cerrado al carrito' }));

      // Assert
      expect(screen.getByText('2 bolsas · 23.91 €')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Vaciar carrito' })).toBeEnabled();
    });

    it('debería volver a "0 bolsas · 0.00 €" cuando se pulsa "Vaciar carrito"', async () => {
      // Arrange
      vi.spyOn(api, 'getCoffees').mockResolvedValue(coffees);
      const user = userEvent.setup();
      render(<CoffeeCatalog />);
      await user.click(
        await screen.findByRole('button', { name: 'Añadir Etiopía Yirgacheffe al carrito' }),
      );
      await user.click(screen.getByRole('button', { name: 'Añadir Brasil Cerrado al carrito' }));

      // Act
      await user.click(screen.getByRole('button', { name: 'Vaciar carrito' }));

      // Assert
      expect(screen.getByText('0 bolsas · 0.00 €')).toBeInTheDocument();
    });
  });
});
