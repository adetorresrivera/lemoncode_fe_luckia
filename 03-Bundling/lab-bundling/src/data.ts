export interface Coffee {
  id: number;
  name: string;
  origin: string;
  price: number;
}

export const coffees: Coffee[] = [
  { id: 1, name: "Etiopía Yirgacheffe", origin: "Etiopía", price: 14.9 },
  { id: 2, name: "Colombia Huila", origin: "Colombia", price: 12.9 },
  { id: 3, name: "Brasil Cerrado", origin: "Brasil", price: 10.5 },
];
