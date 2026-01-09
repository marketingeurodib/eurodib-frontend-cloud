import { strapiGet } from './strapiClient';

export type Dealer = {
  id: number;
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  lat?: number | null;
  lng?: number | null;
  isActive: boolean;
};

export type WhereToBuyPage = {
  title: string;
  subtitle: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  mapCenterLat?: number | null;
  mapCenterLng?: number | null;
  mapDefaultZoom?: number | null;
  postCodePlaceholder?: string | null;
  findButtonText?: string | null;
};

function pickSingle(json: any) {
  return json?.data?.attributes || json?.data || null;
}

export async function fetchWhereToBuyPage(locale?: string): Promise<WhereToBuyPage> {
  const localeParam = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  
  // Пробуем разные варианты именования эндпоинта
  const endpoints = [
    `/api/where-to-buy-page${localeParam}`,
    `/api/wheretobuy-page${localeParam}`,
    `/api/where-to-buy${localeParam}`,
  ];

  let json: any = null;
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      json = await strapiGet(endpoint);
      if (json?.data || json?.data?.attributes) {
        break; // Успешно получили данные
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`[DEALERS] Failed to fetch from ${endpoint}:`, error.message);
      continue; // Пробуем следующий вариант
    }
  }

  if (!json) {
    // Если все варианты не сработали, возвращаем дефолтные значения
    console.warn('[DEALERS] All endpoints failed, using defaults');
    return {
      title: 'Where to buy',
      subtitle: '',
      seoTitle: null,
      seoDescription: null,
      mapCenterLat: null,
      mapCenterLng: null,
      mapDefaultZoom: null,
      postCodePlaceholder: null,
      findButtonText: null,
    };
  }

  const a = pickSingle(json) || {};

  return {
    title: a.title || 'Where to buy',
    subtitle: a.subtitle || '',
    seoTitle: a.seoTitle ?? null,
    seoDescription: a.seoDescription ?? null,
    mapCenterLat: a.mapCenterLat ?? null,
    mapCenterLng: a.mapCenterLng ?? null,
    mapDefaultZoom: a.mapDefaultZoom ?? null,
    postCodePlaceholder: a.postCodePlaceholder ?? null,
    findButtonText: a.findButtonText ?? null,
  };
}

export async function fetchDealers(locale?: string): Promise<Dealer[]> {
  const params = new URLSearchParams();
  params.set('pagination[pageSize]', '500');
  params.set('sort', 'name:asc');
  params.set('filters[isActive][$eq]', 'true');

  if (locale) params.set('locale', locale);

  const json = await strapiGet(`/api/dealers?${params.toString()}`);
  const rows = Array.isArray(json?.data) ? json.data : [];

  return rows.map((row: any) => {
    const a = row?.attributes || row;
    return {
      id: row.id,
      name: a.name || '',
      address1: a.address1 || '',
      address2: a.address2 ?? null,
      city: a.city || '',
      provinceState: a.provinceState || '',
      postalCode: a.postalCode || '',
      country: a.country || '',
      phone: a.phone ?? null,
      email: a.email ?? null,
      website: a.website ?? null,
      lat: a.lat ?? null,
      lng: a.lng ?? null,
      isActive: !!a.isActive,
    };
  });
}
