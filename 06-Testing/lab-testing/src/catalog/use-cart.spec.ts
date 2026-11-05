import { act, renderHook } from '@testing-library/react';
import { useCart } from './use-cart';
import { coffees } from './test-data';

const [, , brazil] = coffees;

describe('useCart', () => {
  it('debería empezar con el carrito vacío, 0 unidades y total 0 cuando se monta el hook', () => {
    // Arrange
    // (nada que preparar: el hook se monta con los tres cafés de test-data)

    // Act
    const { result } = renderHook(() => useCart(coffees));

    // Assert
    expect(result.current.cart).toEqual([]);
    expect(result.current.units).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('debería tener 2 unidades y un total de 21 cuando se añade Brasil dos veces en dos act seguidos', () => {
    // Arrange
    const { result } = renderHook(() => useCart(coffees));

    // Act
    // result.current se lee DENTRO de cada act, después del anterior: cada
    // render deja en result.current un objeto nuevo ({ cart, units, add… }).
    // Si se guardara antes en una constante
    // (const { add, units } = result.current), esa constante se quedaría con
    // el objeto del primer render y units valdría 0 para siempre.
    act(() => {
      result.current.add(brazil);
    });
    act(() => {
      result.current.add(brazil);
    });

    // Assert
    // Se lee result.current otra vez, ahora que los dos act han terminado.
    expect(result.current.units).toBe(2);
    expect(result.current.total).toBeCloseTo(21);
  });

  it('debería quedarse con 0 unidades cuando se añade un café y después se vacía el carrito', () => {
    // Arrange
    const { result } = renderHook(() => useCart(coffees));
    act(() => {
      result.current.add(brazil);
    });

    // Act
    act(() => {
      result.current.clear();
    });

    // Assert
    expect(result.current.units).toBe(0);
  });

  it('debería tener 2 unidades cuando se añade Brasil dos veces dentro del mismo act', () => {
    // Arrange
    const { result } = renderHook(() => useCart(coffees));

    // Act
    // Las dos llamadas van en el mismo act: entre una y otra no hay render,
    // así que las dos usan el add (y el cart) del mismo render.
    act(() => {
      result.current.add(brazil);
      result.current.add(brazil);
    });

    // Assert
    expect(result.current.units).toBe(2);
  });
});
