// pages/api/products.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { products } from '../../data/products';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // В будущем тут можно будет фильтровать по query (category, price, brand и т.д.)
  // Например: ?category=Ice+Makers&minPrice=1000&maxPrice=2000
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ products });
}

