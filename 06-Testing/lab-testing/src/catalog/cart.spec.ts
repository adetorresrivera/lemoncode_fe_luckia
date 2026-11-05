import type { CartItem, Coffee } from './model';
import { addToCart, cartTotal, finalPrice, formatPrice, removeFromCart } from './cart';
import { coffees } from './test-data';

const [ethiopia, colombia, brazil] = coffees;

describe('formatPrice', () => {
  it('debería devolver "14.90 €" cuando el precio es 14.9', () => {
    // Arrange
    const price = 14.9;

    // Act
    const result = formatPrice(price);

    // Assert
    expect(result).toBe('14.90 €');
  });

  it('debería añadir los dos decimales cuando el precio es entero (10 → "10.00 €")', () => {
    // Arrange
    const price = 10;

    // Act
    const result = formatPrice(price);

    // Assert
    expect(result).toBe('10.00 €');
  });
});

describe('finalPrice', () => {
  it('debería aplicar el descuento cuando el café tiene discount (Etiopía → 13.41)', () => {
    // Arrange
    const coffee = ethiopia;

    // Act
    const result = finalPrice(coffee);

    // Assert
    // Comprobado con node -e: 14.9 * (1 - 0.1) === 13.41 da true (por casualidad,
    // el redondeo cae en el mismo double), pero 0.1 + 0.2 da 0.30000000000000004.
    // Un resultado con decimales no tiene por qué ser exacto, así que toBeCloseTo
    // (…, 2): acepta una diferencia menor que 0.005 y no depende de esa casualidad.
    expect(result).toBeCloseTo(13.41, 2);
  });

  it('debería devolver el precio tal cual cuando el café no tiene discount (Colombia → 12.9)', () => {
    // Arrange
    const coffee = colombia;

    // Act
    const result = finalPrice(coffee);

    // Assert
    // 12.9 * (1 - 0) es 12.9 * 1: exacto, así que basta toBe.
    expect(result).toBe(12.9);
  });

  it('debería devolver el precio tal cual cuando el discount es 0', () => {
    // Arrange
    const coffee: Coffee = { ...colombia, discount: 0 };

    // Act
    const result = finalPrice(coffee);

    // Assert
    expect(result).toBe(12.9);
  });
});

describe('addToCart', () => {
  it('debería añadir el café con cantidad 1 cuando el carrito está vacío', () => {
    // Arrange
    const cart: CartItem[] = [];

    // Act
    const result = addToCart(cart, ethiopia.id);

    // Assert
    expect(result).toEqual([{ coffeeId: ethiopia.id, quantity: 1 }]);
  });

  it('debería sumar 1 al café y dejar los demás igual cuando el café ya está en el carrito', () => {
    // Arrange
    const cart: CartItem[] = [
      { coffeeId: ethiopia.id, quantity: 2 },
      { coffeeId: brazil.id, quantity: 1 },
    ];

    // Act
    const result = addToCart(cart, ethiopia.id);

    // Assert
    expect(result).toEqual([
      { coffeeId: ethiopia.id, quantity: 3 },
      { coffeeId: brazil.id, quantity: 1 },
    ]);
  });

  it('no debería modificar el carrito que recibe cuando el café ya está en él', () => {
    // Arrange
    const cart: CartItem[] = [
      { coffeeId: ethiopia.id, quantity: 2 },
      { coffeeId: brazil.id, quantity: 1 },
    ];
    // Copia profunda: con [...cart] la copia compartiría los items con cart, y
    // si addToCart mutase un item cambiarían los dos a la vez.
    const original = structuredClone(cart);

    // Act
    const result = addToCart(cart, ethiopia.id);

    // Assert
    expect(cart).toEqual(original);
    expect(result).not.toBe(cart);
  });
});

describe('removeFromCart', () => {
  it('debería quitar el café indicado y dejar los demás cuando está en el carrito', () => {
    // Arrange
    const cart: CartItem[] = [
      { coffeeId: ethiopia.id, quantity: 1 },
      { coffeeId: colombia.id, quantity: 2 },
      { coffeeId: brazil.id, quantity: 1 },
    ];

    // Act
    const result = removeFromCart(cart, colombia.id);

    // Assert
    expect(result).toEqual([
      { coffeeId: ethiopia.id, quantity: 1 },
      { coffeeId: brazil.id, quantity: 1 },
    ]);
  });
});

describe('cartTotal', () => {
  it('debería devolver 0 cuando el carrito está vacío', () => {
    // Arrange
    const cart: CartItem[] = [];

    // Act
    const result = cartTotal(cart, coffees);

    // Assert
    expect(result).toBe(0);
  });

  it('debería sumar los precios finales por cantidad cuando hay 2 × Etiopía y 1 × Brasil (37.32)', () => {
    // Arrange
    const cart: CartItem[] = [
      { coffeeId: ethiopia.id, quantity: 2 },
      { coffeeId: brazil.id, quantity: 1 },
    ];

    // Act
    const result = cartTotal(cart, coffees);

    // Assert
    // Decimales, igual que en finalPrice: toBeCloseTo (con node -e da 37.32 exacto,
    // pero sería casualidad).
    expect(result).toBeCloseTo(37.32, 2);
  });

  it('debería contar como 0 un coffeeId que no existe en el catálogo', () => {
    // Arrange
    const cart: CartItem[] = [
      { coffeeId: 99, quantity: 3 },
      { coffeeId: brazil.id, quantity: 1 },
    ];

    // Act
    const result = cartTotal(cart, coffees);

    // Assert
    expect(result).toBe(10.5);
  });
});
