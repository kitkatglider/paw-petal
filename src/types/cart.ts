export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  badge: string | null;
  flavor: string;
}