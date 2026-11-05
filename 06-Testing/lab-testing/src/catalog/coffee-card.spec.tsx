import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoffeeCard } from './coffee-card';
import { coffees } from './test-data';

const [ethiopia, colombia] = coffees;

describe('CoffeeCard', () => {
  it('debería mostrar el nombre del café como encabezado de nivel 3', () => {
    // Arrange
    const onAdd = vi.fn();

    // Act
    render(<CoffeeCard coffee={ethiopia} onAdd={onAdd} />);

    // Assert
    expect(
      screen.getByRole('heading', { level: 3, name: 'Etiopía Yirgacheffe' }),
    ).toBeInTheDocument();
  });

  it('debería mostrar el precio final con el descuento aplicado y la etiqueta "-10 %" cuando el café tiene descuento', () => {
    // Arrange
    const onAdd = vi.fn();

    // Act
    render(<CoffeeCard coffee={ethiopia} onAdd={onAdd} />);

    // Assert
    expect(screen.getByText('13.41 €')).toBeInTheDocument();
    expect(screen.getByText('-10 %')).toBeInTheDocument();
  });

  it('no debería mostrar ninguna etiqueta de descuento cuando el café no tiene descuento', () => {
    // Arrange
    const onAdd = vi.fn();

    // Act
    render(<CoffeeCard coffee={colombia} onAdd={onAdd} />);

    // Assert
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('debería llamar a onAdd una vez y con ese café cuando se pulsa el botón de añadir', async () => {
    // Arrange
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<CoffeeCard coffee={colombia} onAdd={onAdd} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Añadir Colombia Huila al carrito' }));

    // Assert
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(colombia);
  });
});
