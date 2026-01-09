import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_INTERNAL_URL;
  if (!base) {
    return res.status(500).json({ error: 'STRAPI_PUBLIC_URL / STRAPI_INTERNAL_URL is not set' });
  }

  const parts = req.query.path as string[]; // ["categories"] etc
  const qs = req.url?.includes('?') ? req.url.split('?')[1] : '';
  const target = `${base.replace(/\/$/, '')}/api/${parts.join('/')}${qs ? `?${qs}` : ''}`;

  try {
    const r = await fetch(target);
    const text = await r.text();

    res.status(r.status);
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (e: any) {
    return res.status(502).json({ error: 'Proxy fetch failed', target, message: e?.message || String(e) });
  }
}

