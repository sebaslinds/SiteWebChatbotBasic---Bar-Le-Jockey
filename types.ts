
export interface MenuItem {
  name: string;
  nameEn?: string; // Optional English name override
  price: string;
  description?: string;
  descriptionEn?: string; // English description
  category: string;
  categoryEn?: string; // English category name
  tags?: string[];
  tagsEn?: string[];
  image?: string;
  baseSpirit?: string;
  baseSpiritEn?: string;
  tastingProfile?: string;
  tastingProfileEn?: string;
  needsCustomization?: boolean;
}

export interface EventItem {
  name: string;
  nameEn?: string;
  date: string;
  dateEn?: string;
  time: string;
  description: string;
  descriptionEn?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  nameEn?: string;
  price: string;
  salePrice?: string;
  image: string;
  isOnSale: boolean;
  category?: string;
  categoryEn?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isPaymentRequest?: boolean;
}

export interface BarData {
  menu: MenuItem[];
  events: EventItem[];
  products: ProductItem[];
}

export type CartItemType = 'product' | 'menu';

export interface CartItem {
  id: string; // Unique identifier (Product ID or Menu Name)
  name: string;
  price: string;
  image?: string;
  quantity: number;
  type: CartItemType;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  customerName: string;
  paymentMethod: 'DEBIT' | 'CASH';
  status: 'pending' | 'completed';
  timestamp: any;
}
