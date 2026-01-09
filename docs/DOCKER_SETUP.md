# Docker Compose Setup для PostgreSQL

## Быстрый старт

### 1. Запуск PostgreSQL

```bash
# Запустить PostgreSQL в фоне
docker-compose up -d

# Проверить статус
docker-compose ps

# Просмотреть логи
docker-compose logs -f postgres
```

### 2. Остановка

```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить volumes (⚠️ удалит данные!)
docker-compose down -v
```

### 3. Подключение к базе

```bash
# Через psql
docker-compose exec postgres psql -U strapi -d eurodib_strapi

# Или через внешний клиент
# Host: localhost
# Port: 5432
# User: strapi
# Password: strapi_password (из .env)
# Database: eurodib_strapi
```

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Измените значения в `.env`:
- `POSTGRES_USER` — пользователь БД
- `POSTGRES_PASSWORD` — пароль (используйте сильный пароль!)
- `POSTGRES_DB` — имя базы данных
- `POSTGRES_PORT` — порт (по умолчанию 5432)

## Использование с Strapi

Когда установите Strapi, используйте эти настройки в `.env` Strapi:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=eurodib_strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_password
DATABASE_SSL=false
```

## Проверка работы

```bash
# Проверить, что PostgreSQL запущен
docker-compose ps

# Должен показать:
# NAME                STATUS          PORTS
# eurodib-postgres    Up (healthy)    0.0.0.0:5432->5432/tcp
```

## Резервное копирование

```bash
# Создать бэкап
docker-compose exec postgres pg_dump -U strapi eurodib_strapi > backup.sql

# Восстановить из бэкапа
docker-compose exec -T postgres psql -U strapi eurodib_strapi < backup.sql
```

## Миграция в eurodib-strapi

Когда создадите репозиторий `eurodib-strapi`:

1. Скопируйте `docker-compose.yml` в корень `eurodib-strapi`
2. Скопируйте `.env.example` в `eurodib-strapi/.env.example`
3. Создайте `.env` в `eurodib-strapi` с реальными значениями
