// lib/utils/cart.ts
// Утилиты для работы с корзиной через localStorage

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  sku: string;
  price: number;
  qty: number;
  image: string;
}

const CART_STORAGE_KEY = 'eurodib_cart';

/**
 * Получить все товары из корзины
 */
export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as CartItem[];
  } catch (error) {
    console.error('[Cart] Error reading cart from localStorage:', error);
    return [];
  }
}

/**
 * Сохранить товары в корзину
 */
export function saveCartItems(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Диспатчим событие для обновления других компонентов (например, счетчик в header)
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
  } catch (error) {
    console.error('[Cart] Error saving cart to localStorage:', error);
  }
}

/**
 * Добавить товар в корзину или увеличить количество, если уже есть
 */
export function addToCart(item: Omit<CartItem, 'id' | 'qty'> & { qty?: number }): void {
  const currentItems = getCartItems();
  
  // Проверяем, есть ли уже такой товар (по SKU)
  const existingIndex = currentItems.findIndex(i => i.sku === item.sku);
  
  if (existingIndex >= 0) {
    // Увеличиваем количество существующего товара
    const existingItem = currentItems[existingIndex];
    currentItems[existingIndex] = {
      ...existingItem,
      qty: existingItem.qty + (item.qty || 1),
    };
  } else {
    // Добавляем новый товар
    const newItem: CartItem = {
      ...item,
      id: Date.now(), // Простой ID на основе timestamp
      qty: item.qty || 1,
    };
    currentItems.push(newItem);
  }
  
  saveCartItems(currentItems);
}

/**
 * Обновить количество товара в корзине
 */
export function updateCartItemQty(sku: string, qty: number): void {
  const items = getCartItems();
  const itemIndex = items.findIndex(i => i.sku === sku);
  
  if (itemIndex >= 0) {
    if (qty <= 0) {
      // Удаляем товар, если количество <= 0
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].qty = qty;
    }
    saveCartItems(items);
  }
}

/**
 * Удалить товар из корзины
 */
export function removeFromCart(sku: string): void {
  const items = getCartItems().filter(i => i.sku !== sku);
  saveCartItems(items);
}

/**
 * Очистить корзину
 */
export function clearCart(): void {
  saveCartItems([]);
}

/**
 * Получить общее количество товаров в корзине
 */
export function getCartTotalQty(): number {
  return getCartItems().reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Получить общую стоимость корзины
 */
export function getCartTotal(): number {
  return getCartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

