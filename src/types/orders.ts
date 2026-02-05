export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type OrderType = 'inbound' | 'outbound';

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  supplier?: string;
  customer?: string;
  items: OrderItem[];
  totalQuantity: number;
  createdAt: Date;
  expectedDate: Date;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  unitPrice: number;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  orderId?: string;
  createdAt: Date;
  notes?: string;
}
