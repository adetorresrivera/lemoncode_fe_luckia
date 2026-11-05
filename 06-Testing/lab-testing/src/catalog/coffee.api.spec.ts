import { getCoffees } from './coffee.api';
import { coffees } from './test-data';

describe('getCoffees', () => {
  describe('cuando la API responde 200', () => {
    it('debería devolver los cafés del campo data cuando la API responde 200', async () => {
      // Arrange
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: coffees }), { status: 200 }),
      );

      // Act
      const result = await getCoffees();

      // Assert
      expect(result).toEqual(coffees);
    });

    it('debería llamar a fetch una vez con "/api/coffees" y la cabecera Accept: application/json', async () => {
      // Arrange
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify({ data: coffees }), { status: 200 }));

      // Act
      await getCoffees();

      // Assert
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/coffees',
        expect.objectContaining({ headers: { Accept: 'application/json' } }),
      );
    });
  });

  describe('cuando la API responde con un error', () => {
    it.each([
      { status: 404, message: 'Catálogo no encontrado' },
      { status: 503, message: 'Servicio no disponible' },
      { status: 500, message: 'Error inesperado' },
    ])('debería rechazar con "$message" cuando la API responde $status', async ({ status, message }) => {
      // Arrange
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ data: coffees }), { status }),
      );

      // Act
      const result = getCoffees();

      // Assert
      await expect(result).rejects.toThrow(message);
    });
  });

  describe('cuando falla la red', () => {
    it('debería propagar el TypeError "Failed to fetch" tal cual cuando fetch rechaza', async () => {
      // Arrange
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      // Act
      const result = getCoffees();

      // Assert
      await expect(result).rejects.toThrow(TypeError);
      await expect(result).rejects.toThrow('Failed to fetch');
    });
  });
});
