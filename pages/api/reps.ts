import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchRepRegions } from '../../lib/api/reps';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const country = (req.query.country === 'ca' ? 'ca' : 'us') as 'ca' | 'us';
    const regions = await fetchRepRegions(country);
    res.status(200).json({ regions });
  } catch (e: any) {
    res.status(500).json({ regions: [], error: e?.message || 'Error' });
  }
}

