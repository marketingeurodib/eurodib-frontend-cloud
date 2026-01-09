# Решения по подготовке к Strapi

**Дата:** 2024-12-12  
**Цель:** Зафиксировать архитектурные решения до установки Strapi, чтобы не переделывать всё через месяц.

---

## 5.1. Разделение ответственности данных (Data Master)

### SAP = Транзакционные данные
- ✅ **Транзакции** (заказы, продажи)
- ✅ **Цены** (актуальные цены на товары)
- ✅ **Остатки** (наличие товаров на складах)
- ✅ **Заказы** (история заказов клиентов)
- ✅ **Клиенты** (данные клиентов, компании)

**Принцип:** SAP — единственный источник правды для транзакционных данных.

### Strapi = Маркетинговый контент
- ✅ **Маркетинг** (промо-материалы, акции)
- ✅ **Контент** (описания товаров, брендов, категорий)
- ✅ **Медиа** (изображения, видео, PDF каталоги)
- ✅ **SEO** (мета-теги, описания, структурированные данные)
- ✅ **Брендовые страницы** (контент для страниц брендов)

**Принцип:** Strapi — источник маркетингового контента и медиа.

### Синхронизация
- SAP → Strapi: периодическая синхронизация товаров, цен, остатков
- Strapi → Frontend: контент и медиа через API
- SAP → Frontend: транзакционные данные через API (или через Strapi как прокси)

---

## 5.2. Мультиязычность (i18n)

### Языки
- ✅ **EN** (English) — основной язык
- ✅ **FR** (Français) — второй язык

### Реализация
- Использовать Next.js i18n routing (`/en/...`, `/fr/...`)
- Или использовать Strapi i18n plugin (рекомендуется)
- Все тексты в Strapi должны быть мультиязычными с первого дня

### Структура URL
**Вариант 1 (Next.js routing):**
- `/en/products/...`
- `/fr/products/...`

**Вариант 2 (Strapi i18n):**
- `/products/...` (язык определяется из заголовков или сессии)
- Или `/products?locale=en`

**Рекомендация:** Использовать Strapi i18n plugin для единообразия.

---

## 5.3. База данных

### PostgreSQL только
- ✅ **Только PostgreSQL** (production)
- ❌ **Без SQLite** (только для локальной разработки, если необходимо)
- ❌ **Без MongoDB** (не использовать)

### Причины
- Надёжность и консистентность данных
- Поддержка транзакций
- Интеграция с SAP (обычно использует SQL)
- Масштабируемость

### Конфигурация
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=eurodib_strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=***
DATABASE_SSL=false
```

---

## 5.4. Репозитории

### Структура проектов

#### 1. `eurodib-frontend` (текущий)
- **Назначение:** Next.js фронтенд
- **Технологии:** Next.js 16, TypeScript, React
- **Данные:** Получает данные из Strapi API и SAP API
- **Расположение:** `/Users/dmytromoroz/Desktop/edib/eurodib-frontend`

#### 2. `eurodib-strapi` (новый, создать)
- **Назначение:** Strapi CMS для маркетингового контента
- **Технологии:** Strapi 5.x, PostgreSQL
- **Данные:** Контент, медиа, SEO, описания товаров/брендов
- **API:** REST API и/или GraphQL

#### 3. `sap-sync` (опционально, позже)
- **Назначение:** Сервис синхронизации SAP → Strapi
- **Технологии:** Node.js, TypeScript
- **Функции:**
  - Периодическая синхронизация товаров из SAP в Strapi
  - Обновление цен и остатков
  - Синхронизация данных клиентов (если нужно)

---

## 5.5. Модели данных в Strapi

### Основные коллекции

#### Product (Товар)
- `sku` (string, unique) — из SAP
- `name` (text, i18n)
- `description` (richtext, i18n)
- `brand` (relation → Brand)
- `category` (relation → Category)
- `price` (decimal) — синхронизируется из SAP
- `inStock` (boolean) — синхронизируется из SAP
- `images` (media, multiple)
- `seo` (component)

#### Brand (Бренд)
- `slug` (string, unique)
- `name` (text, i18n)
- `description` (richtext, i18n)
- `logo` (media)
- `bannerImage` (media)
- `seo` (component)

#### Category (Категория)
- `slug` (string, unique)
- `name` (text, i18n)
- `description` (richtext, i18n)
- `bannerImage` (media)
- `seo` (component)

#### Video (Видео)
- `title` (text, i18n)
- `brand` (relation → Brand)
- `category` (relation → Category)
- `sku` (string) — привязка к товару
- `thumbnailUrl` (media)
- `videoUrl` (string) — ссылка на видео
- `sizeMb` (decimal)

#### Catalogue (Каталог)
- `brand` (relation → Brand)
- `year` (string)
- `thumbUrl` (media)
- `fileUrl` (media) — PDF файл

#### Promo (Промо)
- `title` (text, i18n)
- `dateFrom` (date)
- `dateTo` (date)
- `thumbUrl` (media)
- `fileUrl` (media) — PDF/JPG файл

#### PriceList (Прайс-лист)
- `title` (text, i18n)
- `region` (string) — US, CA, etc.
- `validFrom` (date)
- `validTo` (date)
- `fileUrl` (media) — PDF/XLSX файл

---

## 5.6. API Endpoints (планируемые)

### Strapi API
```
GET /api/products?populate=*
GET /api/products?filters[brand][slug][$eq]=atmovac&populate=*
GET /api/brands?filters[slug][$eq]=atmovac&populate=*
GET /api/categories?filters[slug][$eq]=ice-machines&populate=*
GET /api/videos?populate=*
GET /api/catalogues?populate=*
GET /api/promos?populate=*
GET /api/price-lists?populate=*
```

### SAP API (через прокси или напрямую)
```
GET /api/sap/products/{sku}
GET /api/sap/orders?customerId={id}
POST /api/sap/orders (создание заказа)
```

---

## 5.7. Переменные окружения

### Frontend (.env.local)
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=***
NEXT_PUBLIC_SAP_API_URL=https://sap-api.example.com
```

### Strapi (.env)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=***
API_TOKEN_SALT=***
ADMIN_JWT_SECRET=***
TRANSFER_TOKEN_SALT=***
JWT_SECRET=***

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=eurodib_strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=***
DATABASE_SSL=false
```

---

## 5.8. Миграция данных

### Этапы
1. **Установка Strapi** с PostgreSQL
2. **Создание моделей** в Strapi (Product, Brand, Category, etc.)
3. **Импорт существующих данных** из моков в Strapi
4. **Обновление `lib/api/*`** для запросов к Strapi
5. **Тестирование** всех страниц
6. **Настройка синхронизации** SAP → Strapi (если нужно)

---

## 5.9. Важные решения

### ✅ Принято
- SAP = транзакции, Strapi = контент
- PostgreSQL только
- Мультиязычность EN + FR с первого дня
- Отдельный репозиторий для Strapi
- Все данные через `lib/api/*` слой

### ⚠️ Требует решения
- Структура URL для мультиязычности (Next.js routing vs Strapi i18n)
- Частота синхронизации SAP → Strapi
- Аутентификация (NextAuth, Strapi Auth, или кастомная)
- Кэширование данных (Next.js ISR, Strapi cache, или внешний CDN)

---

## 5.10. Чеклист перед установкой Strapi

- [ ] Создать репозиторий `eurodib-strapi`
- [ ] Настроить PostgreSQL базу данных
- [ ] Определить структуру URL для мультиязычности
- [ ] Решить вопрос с аутентификацией
- [ ] Подготовить план миграции данных
- [ ] Настроить переменные окружения
- [ ] Создать модели в Strapi согласно этому документу

---

**Последнее обновление:** 2024-12-12
