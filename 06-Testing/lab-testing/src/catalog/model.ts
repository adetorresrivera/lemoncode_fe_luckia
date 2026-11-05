export interface Coffee {
  id: number;
  name: string;
  origin: string;
  price: number;
  discount?: number;
}

export interface CartItem {
  coffeeId: number;
  quantity: number;
}
