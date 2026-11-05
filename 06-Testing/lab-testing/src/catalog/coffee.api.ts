import type { Coffee } from './model';

export const url = '/api/coffees';

export const getCoffees = async (): Promise<Coffee[]> => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('Catálogo no encontrado');
      case 503:
        throw new Error('Servicio no disponible');
      default:
        throw new Error('Error inesperado');
    }
  }

  const { data } = await response.json();
  return data;
};
