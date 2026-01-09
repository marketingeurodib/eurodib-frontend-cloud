// lib/productsApi.ts

import type { Product } from '../data/products';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Fetches all products from the API.
 * @returns Promise<Product[]> Array of products
 * @throws Error if fetch fails
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}

/**
 * Fetches a single product by SKU.
 * @param sku - Product SKU
 * @returns Promise<Product | null> Product if found, null if not found
 * @throws Error if fetch fails (except 404)
 */
export async function fetchProductBySku(sku: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(sku)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch product');
  const data = await res.json();
  return data.product;
}

