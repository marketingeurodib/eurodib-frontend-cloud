/**
 * Базовый клиент для работы со Strapi API
 * Обеспечивает единообразные запросы с авторизацией, обработкой ошибок и построением query string
 */

export const STRAPI_URL =
  process.env.STRAPI_URL ||
  'http://localhost:1337'; // временно, дальше заменим на правильный URL
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

/**
 * Параметры для построения query string
 */
export interface StrapiQueryParams {
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  locale?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  sort?: string | string[];
  fields?: string | string[];
  publicationState?: 'live' | 'preview';
}

/**
 * Построение query string из параметров Strapi
 */
function buildQueryString(params: StrapiQueryParams): string {
  const queryParts: string[] = [];

  // Populate
  if (params.populate) {
    if (typeof params.populate === 'string') {
      queryParts.push(`populate=${encodeURIComponent(params.populate)}`);
    } else if (Array.isArray(params.populate)) {
      params.populate.forEach((field) => {
        queryParts.push(`populate[${field}]=true`);
      });
    } else {
      // Object format: { brand: true, category: { populate: { logo: '*' } } }
      // Рекурсивная функция для построения глубокого populate
      const buildPopulateQuery = (obj: Record<string, unknown>, prefix: string = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}[${key}]` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Вложенный объект - рекурсивно обрабатываем
            if ('populate' in value) {
              // Формат: { populate: { logo: '*' } }
              buildPopulateQuery(value.populate as Record<string, unknown>, `${fullKey}[populate]`);
            } else {
              // Обычный вложенный объект
              buildPopulateQuery(value as Record<string, unknown>, fullKey);
            }
          } else {
            // Примитивное значение
            queryParts.push(`populate[${fullKey}]=${value === '*' ? '*' : value}`);
          }
        });
      };
      buildPopulateQuery(params.populate as Record<string, unknown>);
    }
  }

  // Filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Nested filters: { brand: { slug: { $eq: 'atmovac' } } }
          Object.entries(value as Record<string, unknown>).forEach(([filterKey, filterValue]) => {
            if (typeof filterValue === 'object' && filterValue !== null) {
              Object.entries(filterValue as Record<string, unknown>).forEach(([op, opValue]) => {
                queryParts.push(`filters[${key}][${filterKey}][${op}]=${encodeURIComponent(String(opValue))}`);
              });
            } else {
              queryParts.push(`filters[${key}][${filterKey}]=${encodeURIComponent(String(filterValue))}`);
            }
          });
        } else if (Array.isArray(value)) {
          // Array filters: { categories: { $in: [1, 2, 3] } }
          queryParts.push(`filters[${key}][$in]=${value.join(',')}`);
        } else {
          // Simple equality: { slug: 'atmovac' }
          queryParts.push(`filters[${key}][$eq]=${encodeURIComponent(String(value))}`);
        }
      }
    });
  }

  // Locale
  if (params.locale) {
    queryParts.push(`locale=${encodeURIComponent(params.locale)}`);
  }

  // Pagination
  if (params.pagination) {
    if (params.pagination.page !== undefined) {
      queryParts.push(`pagination[page]=${params.pagination.page}`);
    }
    if (params.pagination.pageSize !== undefined) {
      queryParts.push(`pagination[pageSize]=${params.pagination.pageSize}`);
    }
    if (params.pagination.start !== undefined) {
      queryParts.push(`pagination[start]=${params.pagination.start}`);
    }
    if (params.pagination.limit !== undefined) {
      queryParts.push(`pagination[limit]=${params.pagination.limit}`);
    }
  }

  // Sort
  if (params.sort) {
    if (Array.isArray(params.sort)) {
      params.sort.forEach((sortField) => {
        queryParts.push(`sort[]=${encodeURIComponent(sortField)}`);
      });
    } else {
      queryParts.push(`sort=${encodeURIComponent(params.sort)}`);
    }
  }

  // Fields
  if (params.fields) {
    if (Array.isArray(params.fields)) {
      params.fields.forEach((field) => {
        queryParts.push(`fields[]=${encodeURIComponent(field)}`);
      });
    } else {
      queryParts.push(`fields=${encodeURIComponent(params.fields)}`);
    }
  }

  // Publication state
  if (params.publicationState) {
    queryParts.push(`publicationState=${params.publicationState}`);
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

/**
 * Класс ошибки Strapi API
 */
export class StrapiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

/**
 * Базовый метод для запросов к Strapi API
 */
export async function strapiFetch<T>(
  endpoint: string,
  params?: StrapiQueryParams,
  options: RequestInit = {}
): Promise<T> {
  // Построение URL
  const baseUrl = endpoint.startsWith('http') ? endpoint : `${STRAPI_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const queryString = params ? buildQueryString(params) : '';
  const url = `${baseUrl}${queryString}`;

  // Заголовки
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Добавляем токен авторизации, если он есть
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    // Логируем запрос
    if (typeof window === 'undefined') {
      console.log('[STRAPI FETCH] Request:', {
        endpoint,
        url,
        hasToken: !!STRAPI_TOKEN,
      });
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Логирование ответа Strapi
    if (typeof window === 'undefined') {
      console.log('[STRAPI FETCH] Response:', {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    // Получаем данные из ответа (только один раз!)
    let data: any;
    try {
      data = await response.json();
    } catch (jsonError) {
      // Если не удалось распарсить JSON, пробуем получить текст
      const text = await response.text().catch(() => '');
      console.error('[STRAPI FETCH] Failed to parse JSON:', text.slice(0, 200));
      throw new StrapiError(
        `Strapi API error: ${response.status} ${response.statusText} - Invalid JSON`,
        response.status,
        response.statusText,
        text
      );
    }

    // Обработка ошибок HTTP
    if (!response.ok) {
      console.error('[STRAPI ERROR]', endpoint, response.status, data);
      throw new StrapiError(
        `Strapi API error: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText,
        data
      );
    }

    if (typeof window === 'undefined') {
      console.log('[STRAPI SUCCESS]', endpoint, 'data length:', Array.isArray(data?.data) ? data.data.length : 'single item');
    }
    
    return data;
  } catch (error) {
    // Перебрасываем StrapiError как есть
    if (error instanceof StrapiError) {
      throw error;
    }

    // Оборачиваем сетевые ошибки
    if (error instanceof Error) {
      const errorMessage = error.message || 'Unknown network error';
      if (typeof window === 'undefined') {
        console.error('[STRAPI FETCH] Network error:', {
          endpoint,
          url,
          message: errorMessage,
          error: error.name || 'Error',
        });
      }
      throw new StrapiError(`Network error: ${errorMessage}`, undefined, undefined, error);
    }

    throw new StrapiError('Unknown error occurred', undefined, undefined, error);
  }
}

/**
 * Получить коллекцию из Strapi
 */
export async function strapiGetCollection<T>(
  endpoint: string,
  params?: StrapiQueryParams,
  options?: RequestInit
): Promise<T[]> {
  const response = await strapiFetch<{ data: T[] }>(endpoint, params, options);
  return response.data || [];
}

/**
 * Получить один элемент из Strapi
 */
export async function strapiGetOne<T>(
  endpoint: string,
  params?: StrapiQueryParams,
  options?: RequestInit
): Promise<T | null> {
  const response = await strapiFetch<{ data: T }>(endpoint, params, options);
  return response.data || null;
}

type StrapiGetOptions = {
  headers?: Record<string, string>;
};

function isServer() {
  return typeof window === 'undefined';
}

/**
 * На сервере: идём напрямую в Strapi по STRAPI_INTERNAL_URL (самый надежный путь).
 * В браузере: идём через Next API proxy /api/_strapi чтобы не было CORS и чтобы скрыть внутренний URL.
 */
function getBaseUrl(): string {
  if (isServer()) {
    const base = process.env.STRAPI_INTERNAL_URL || process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL;
    if (!base) {
      const error = 'STRAPI_INTERNAL_URL / STRAPI_PUBLIC_URL / STRAPI_URL is not set';
      console.error('[STRAPI]', error);
      throw new Error(error);
    }
    const cleaned = base.replace(/\/$/, '');
    if (typeof window === 'undefined') {
      console.log('[STRAPI] getBaseUrl() server base:', cleaned);
    }
    return cleaned;
  }
  // client → proxy
  return '';
}

/**
 * Простой GET запрос к Strapi
 * - На сервере (SSR): прямой вызов к Strapi по STRAPI_INTERNAL_URL
 * - На клиенте: через Next.js proxy endpoint для избежания CORS
 */
export async function strapiGet(path: string, options: StrapiGetOptions = {}): Promise<any> {
  const base = getBaseUrl();

  // path ожидаем вида "/api/categories?...."
  const url = isServer()
    ? `${base}${path}`
    : `/api/_strapi${path.replace(/^\/api/, '/api')}`; // безопасно, если path начинается с /api

  if (typeof window === 'undefined') {
    console.log('[STRAPI GET]', `path="${path}" url="${url}" base="${base}"`);
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const errorMsg = `Strapi GET failed: ${res.status} ${res.statusText} | ${text.slice(0, 300)}`;
      if (typeof window === 'undefined') {
        console.error('[STRAPI GET ERROR]', errorMsg);
      }
      throw new Error(errorMsg);
    }

    const json = await res.json();
    if (typeof window === 'undefined') {
      console.log('[STRAPI GET SUCCESS]', url, 'data:', Array.isArray(json?.data) ? `array(${json.data.length})` : 'object');
    }
    return json;
  } catch (e: any) {
    const errorMsg = `[STRAPI FETCH ERROR] url=${url} message=${e?.message || e}`;
    if (typeof window === 'undefined') {
      console.error('[STRAPI FETCH ERROR]', errorMsg);
      if (e?.code) {
        console.error('[STRAPI ERROR CODE]', e.code);
      }
    }
    // Важно: именно это сообщение ты потом увидишь в терминале Next
    throw new Error(errorMsg);
  }
}

/**
 * Преобразует относительный URL медиа в абсолютный
 */
export function absoluteMediaUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;

  // Для SSR и для client — норм
  const publicBase = (process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_INTERNAL_URL || '').replace(/\/$/, '');
  if (!publicBase) return url;

  return `${publicBase}${url.startsWith('/') ? '' : '/'}${url}`;
}
