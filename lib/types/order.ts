// lib/types/order.ts
// Типы для заказов

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  qty: number;
  imageUrl: string;
  sapOrderLineId?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  placedOn: string; // уже отформатированная дата для вывода
  items: OrderItem[];
}
