
export interface Region {
  id: string;
  name: string;
  flag: string;
}

export interface Denomination {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageColor: string; // Gradient fallback
  imageUrl?: string; // Real image URL
  tag?: string; // e.g. "New", "Sale"
  description?: string;
  stock?: number;
  regions?: Region[]; // Available regions for this product
  denominations?: Denomination[]; // Available quantities/prices
}

export interface CartItem {
  id: string; // Unique ID for the cart entry
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageColor: string;
  selectedRegion?: Region;
  selectedDenomination?: Denomination;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: any; // Lucide icon component
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending';
  icon: any;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  rate: number; // Exchange rate relative to USD
  symbol: string;
}

export interface TermSection {
  id: string;
  titleAr: string;
  contentAr: string[]; 
  titleEn: string;
  contentEn: string[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  bg: string;
  pattern?: string;
  imageUrl?: string; // URL for custom image banner
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  joinedDate: string;
  status: 'active' | 'banned';
  ip?: string;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'alert' | 'info';
  isActive: boolean;
  date: string;
}

export enum View {
  HOME = 'home',
  SEARCH = 'search',
  WALLET = 'wallet',
  ORDERS = 'orders',
  PROFILE = 'profile',
  NOTIFICATIONS = 'notifications',
  CART = 'cart',
  ADMIN = 'admin'
}