// lib/api/orders.ts
// API для получения заказов
// TODO: Заменить на реальный запрос к SAP/Strapi
// Пример: const res = await fetch(`${process.env.SAP_API_URL}/orders?customerId=${customerId}`);

import type { Order } from '../types/order';

export type { Order, OrderItem } from '../types/order';

export async function fetchOrders(customerId?: string): Promise<Order[]> {
  // TODO: здесь будет:
  // 1) Проверка авторизации
  // 2) Получение customerId из сессии
  // 3) Запрос истории заказов из SAP (через твой сервис) +/или Strapi
  // const res = await fetch(`${process.env.SAP_API_URL}/orders?customerId=${customerId}`, {
  //   headers: {
  //     Authorization: `Bearer ${process.env.SAP_TOKEN}`,
  //   },
  // });
  // const data = await res.json();
  // return mapSapToOrders(data);

  // Возвращаем пустой массив до подключения реального API
  return [];
}

