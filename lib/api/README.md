# API Layer Structure

Единый слой для работы с данными. **Подключен к Strapi** с fallback на мок-данные.

## Структура

```
/lib
  /api          - Функции fetchXxx() для получения данных
  /mock         - Мок-данные (временно, до подключения Strapi)
  /types        - TypeScript типы для всех сущностей
  /utils        - Утилиты (filterConfig и т.д.)
```

## Принцип работы

1. **Страницы вызывают `fetchXxx()` из `lib/api/*`**
2. **`fetchXxx()` запрашивает данные из Strapi через базовый клиент `strapiClient.ts`**
3. **При ошибке или отсутствии данных — fallback на мок-данные или старый API**

## Файлы API

- `strapiClient.ts` - **Базовый клиент Strapi** с авторизацией, обработкой ошибок и построением query string
- `strapi.ts` - Дополнительные функции для работы со Strapi (legacy, использует `strapiClient.ts`)
- `videos.ts` - `fetchVideos(locale?)` → **Strapi** `/api/videos` (fallback: `mockVideos`)
- `catalogues.ts` - `fetchCatalogues(locale?)` → **Strapi** `/api/catalogues` (fallback: `mockCatalogues`)
- `promos.ts` - `fetchPromos(locale?)` → **Strapi** `/api/promos` (fallback: `mockPromos`)
- `priceLists.ts` - `fetchPriceLists(locale?)` → **Strapi** `/api/price-lists` (fallback: `mockPriceLists`)
- `products.ts` - `fetchProducts(locale?)`, `fetchProductBySku(sku, locale?)` → **Strapi** `/api/products` с relations (fallback: `productsApi.ts`)
- `brands.ts` - `fetchProductsByBrandSlug(slug, locale?)`, `getBrandDataBySlug(slug, locale?)` → **Strapi** (fallback: старый API)
- `orders.ts` - `fetchOrders()` → `mockOrders` (TODO: подключить SAP)

## Типы

Все типы вынесены в `lib/types/*`:
- `video.ts` - `VideoItem`
- `catalogue.ts` - `CatalogEntry`
- `promo.ts` - `PromoItem`
- `priceList.ts` - `PriceListItem`
- `order.ts` - `Order`, `OrderItem`
- `product.ts` - `Product`

## Мок-данные

Все мок-данные в `lib/mock/*`:
- `videos.mock.ts` - `mockVideos`
- `catalogues.mock.ts` - `mockCatalogues`
- `promos.mock.ts` - `mockPromos`
- `priceLists.mock.ts` - `mockPriceLists`
- `orders.mock.ts` - `mockOrders`

## Подключение к Strapi

✅ **Strapi подключен!** Все API функции используют базовый клиент `strapiClient.ts`.

### Конфигурация

Переменные окружения в `.env.local`:
```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_readonly_token_here
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Базовый клиент `strapiClient.ts`

Предоставляет:
- `strapiFetch<T>(endpoint, params?, options?)` - базовая функция для запросов с авторизацией
- `strapiGetCollection<T>(endpoint, params?, options?)` - получение коллекции
- `strapiGetOne<T>(endpoint, params?, options?)` - получение одного элемента
- `StrapiQueryParams` - типизированные параметры для query string
- `StrapiError` - класс ошибки для обработки ошибок API

#### Параметры запроса

`StrapiQueryParams` поддерживает:
- `populate` - загрузка связанных данных (string, array, object)
- `filters` - фильтрация данных
- `locale` - локаль (en, fr)
- `pagination` - пагинация (page, pageSize, start, limit)
- `sort` - сортировка
- `fields` - выбор полей
- `publicationState` - состояние публикации

### Пример использования

```typescript
// В lib/api/videos.ts
import { strapiGetCollection, type StrapiQueryParams } from './strapiClient';

export async function fetchVideos(locale: string = 'en'): Promise<VideoItem[]> {
  try {
    const params: StrapiQueryParams = {
      populate: '*',
      locale,
    };

    const strapiVideos = await strapiGetCollection<StrapiVideo>(
      '/api/videos',
      params,
      {
        next: { revalidate: 3600 }, // Кэш на 1 час
      }
    );

    if (strapiVideos && strapiVideos.length > 0) {
      return strapiVideos.map(mapStrapiToVideo);
    }

    return mockVideos; // Fallback
  } catch (error) {
    console.error('Error fetching videos from Strapi:', error);
    return mockVideos; // Fallback при ошибке
  }
}
```

### Миграция завершена

✅ **videos.ts** - мигрирован (минимальные связи)  
✅ **promos.ts** - мигрирован  
✅ **catalogues.ts** - мигрирован  
✅ **priceLists.ts** - мигрирован  
✅ **brands.ts** - мигрирован (частично, с fallback)  
✅ **products.ts** - мигрирован (с relations: brand, category, image)

**Страницы менять не нужно!** Они продолжают вызывать `fetchVideos()`, `fetchProducts()` и т.д.
