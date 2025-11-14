export interface ProductPriceHistory {
    costPrice: number;
    date: string; // ISO string
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  description: string;
  lastUpdated: string; // ISO string
  location: string;
  supplierIds: string[];
  reorderQuantity: number;
  priceHistory: ProductPriceHistory[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'common';
}

export type ActivityLogAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_PRODUCT'
  | 'UPDATE_PRODUCT'
  | 'DELETE_PRODUCT'
  | 'UPDATE_PRODUCT_QUANTITY'
  | 'ADD_USER'
  | 'DELETE_USER'
  | 'UPDATE_USER_PASSWORD'
  | 'ADD_CATEGORY'
  | 'UPDATE_CATEGORY'
  | 'DELETE_CATEGORY'
  | 'ADD_LOCATION'
  | 'UPDATE_LOCATION'
  | 'DELETE_LOCATION'
  | 'ADD_SUPPLIER'
  | 'UPDATE_SUPPLIER'
  | 'DELETE_SUPPLIER';

export interface ActivityLog {
  id: string;
  user: string; // username
  action: ActivityLogAction;
  details: string;
  timestamp: string; // ISO string
  oldValue?: string | number;
  newValue?: string | number;
}

export type Category = string;

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  products: { productId: string; quantity: number }[];
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string; // ISO string
}

export interface Notification {
  id: string;
  type: 'low_stock';
  message: string;
  productId: string;
  timestamp: string; // ISO string
  read: boolean;
}
