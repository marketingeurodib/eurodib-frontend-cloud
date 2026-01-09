import { strapiGet } from './strapiClient';

export type CountryCode = 'us' | 'ca';

export type RepContact = {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
};

export type RepRegion = {
  id: string;
  country: CountryCode;
  label: string;
  codes: string[];
  contacts: RepContact[];

  centerLat?: number | null;
  centerLng?: number | null;
  radiusKm?: number | null;

  polygonGeoJson?: any | null;
  isActive: boolean;
};

export type OurRepsPage = {
  title: string;
  subtitle: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  defaultCountry?: CountryCode | null;
  mapCenterLat?: number | null;
  mapCenterLng?: number | null;
  mapDefaultZoom?: number | null;
  searchPlaceholder?: string | null;
  findButtonText?: string | null;
};

function pickSingle(json: any) {
  return json?.data?.attributes || json?.data || null;
}

export async function fetchOurRepsPage(locale?: string): Promise<OurRepsPage> {
  const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  
  // Пробуем разные варианты именования эндпоинта
  const endpoints = [
    `/api/our-reps-page${q}`,
    `/api/ourreps-page${q}`,
    `/api/our-reps${q}`,
  ];

  let json: any = null;

  for (const endpoint of endpoints) {
    try {
      json = await strapiGet(endpoint);
      if (json?.data || json?.data?.attributes) {
        break; // Успешно получили данные
      }
    } catch (error: any) {
      console.warn(`[REPS] Failed to fetch from ${endpoint}:`, error.message);
      continue; // Пробуем следующий вариант
    }
  }

  if (!json) {
    // Если все варианты не сработали, возвращаем дефолтные значения
    console.warn('[REPS] All endpoints failed, using defaults');
    return {
      title: 'Our reps',
      subtitle: '',
      seoTitle: null,
      seoDescription: null,
      defaultCountry: null,
      mapCenterLat: null,
      mapCenterLng: null,
      mapDefaultZoom: null,
      searchPlaceholder: null,
      findButtonText: null,
    };
  }

  const a = pickSingle(json) || {};

  return {
    title: a.title || 'Our reps',
    subtitle: a.subtitle || '',
    seoTitle: a.seoTitle ?? null,
    seoDescription: a.seoDescription ?? null,
    defaultCountry: a.defaultCountry ?? null,
    mapCenterLat: a.mapCenterLat ?? null,
    mapCenterLng: a.mapCenterLng ?? null,
    mapDefaultZoom: a.mapDefaultZoom ?? null,
    searchPlaceholder: a.searchPlaceholder ?? null,
    findButtonText: a.findButtonText ?? null,
  };
}

export async function fetchRepRegions(country: CountryCode, locale?: string): Promise<RepRegion[]> {
  const params = new URLSearchParams();
  params.set('filters[country][$eq]', country);
  params.set('filters[isActive][$eq]', 'true');
  params.set('sort', 'label:asc');

  // contacts — component, polygon — json, центры — числа
  // populate=* проще, пока не оптимизируем
  params.set('populate', '*');

  if (locale) params.set('locale', locale);

  const json = await strapiGet(`/api/rep-regions?${params.toString()}`);
  const rows = Array.isArray(json?.data) ? json.data : [];

  return rows.map((row: any) => {
    const a = row?.attributes || row;

    return {
      id: String(row.id),
      country: a.country,
      label: a.label || '',
      codes: Array.isArray(a.codes) ? a.codes : [],
      contacts: Array.isArray(a.contacts)
        ? a.contacts.map((c: any) => ({
            name: c.name || '',
            company: c.company ?? null,
            email: c.email ?? null,
            phone: c.phone ?? null,
            website: c.website ?? null,
          }))
        : [],
      centerLat: a.centerLat ?? null,
      centerLng: a.centerLng ?? null,
      radiusKm: a.radiusKm ?? null,
      polygonGeoJson: a.polygonGeoJson ?? null,
      isActive: !!a.isActive,
    };
  });
}

