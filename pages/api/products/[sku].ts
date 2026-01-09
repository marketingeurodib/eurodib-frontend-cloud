// pages/api/products/[sku].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { products } from '../../../data/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sku } = req.query;

  if (typeof sku !== 'string') {
    return res.status(400).json({ error: 'Invalid SKU' });
  }

  const decodedSku = decodeURIComponent(sku);
  const product = products.find((p) => p.sku === decodedSku);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.status(200).json({ product });
}

