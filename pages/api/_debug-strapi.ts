import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.STRAPI_URL || 'MISSING_STRAPI_URL';
  const url = `${base}/api/categories?locale=en-CA`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    res.status(200).json({
      base,
      url,
      status: r.status,
      bodyPreview: text.slice(0, 400),
    });
  } catch (e: any) {
    res.status(500).json({
      base,
      url,
      error: String(e?.message || e),
    });
  }
}

