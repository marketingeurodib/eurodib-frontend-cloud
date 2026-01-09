# Catalog Components

## ArchiveTemplate

Универсальный компонент для отображения списка товаров с фильтрами. Используется для:
- Брендов (кроме специальных: ATMOVAC, EURODIB, RESOLUTE)
- Категорий
- Любых других архивных страниц

### Использование

```tsx
import { ArchiveTemplate } from '@/components/catalog/ArchiveTemplate';

<ArchiveTemplate
  title="Brand Name"
  description="Brand description"
  products={products}
  filterConfig={filterConfig}
  bannerImage="/path/to/banner.jpg"
  bannerAlt="Banner alt text"
/>
```

### Props

- `title: string` - Заголовок страницы
- `description?: string` - Описание (поддерживает HTML)
- `products: Product[]` - Массив продуктов
- `filterConfig?: FilterConfig` - Конфигурация фильтров
- `breadcrumbs?: Array<{ label: string; href?: string }>` - Хлебные крошки
- `bannerImage?: string` - URL баннера
- `bannerAlt?: string` - Alt текст для баннера
- `error?: boolean` - Флаг ошибки загрузки
- `className?: string` - Дополнительные CSS классы

## Структура страниц

### Бренды

- **Специальные бренды** (кастомные страницы):
  - `/brands/atmovac` → `pages/brands/atmovac.tsx`
  - `/brands/resolute` → `pages/brands/resolute.tsx`
  - `/brands/eurodib` → `pages/brands/eurodib.tsx`

- **Остальные бренды** (динамические):
  - `/brands/[brandSlug]` → `pages/brands/[brandSlug].tsx`
  - Использует `ArchiveTemplate`

### Категории

- `/categories/[categorySlug]` → `pages/categories/[categorySlug].tsx`
- Использует `ArchiveTemplate`

## Интеграция со Strapi

Когда подключите Strapi, замените в `getServerSideProps`:

1. Импортируйте функции из `@/lib/api/strapi`:
```tsx
import { getBrandBySlug, getProductsByBrandSlug } from '@/lib/api/strapi';
```

2. Используйте вместо локального API:
```tsx
const brand = await getBrandBySlug(slug);
const products = await getProductsByBrandSlug(slug);
```

3. Типы уже готовы в `@/lib/types/strapi`
