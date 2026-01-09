# Инструкция по миграции Docker Compose в eurodib-strapi

Когда создадите репозиторий `eurodib-strapi`, скопируйте следующие файлы:

## Файлы для копирования

1. **`docker-compose.yml`** → `eurodib-strapi/docker-compose.yml`
2. **`.env.example`** → `eurodib-strapi/.env.example`

## Шаги миграции

### 1. Создать репозиторий eurodib-strapi

```bash
mkdir eurodib-strapi
cd eurodib-strapi
git init
```

### 2. Скопировать файлы

```bash
# Из eurodib-frontend
cp ../eurodib-frontend/docker-compose.yml .
cp ../eurodib-frontend/.env.example .
```

### 3. Создать .env

```bash
cp .env.example .env
# Отредактируйте .env и измените пароли на безопасные
```

### 4. Запустить PostgreSQL

```bash
docker-compose up -d
```

### 5. Проверить подключение

```bash
docker-compose ps
# Должен показать: eurodib-postgres    Up (healthy)
```

## Структура eurodib-strapi после миграции

```
eurodib-strapi/
  ├── docker-compose.yml    ← скопировать из eurodib-frontend
  ├── .env.example          ← скопировать из eurodib-frontend
  ├── .env                  ← создать на основе .env.example
  ├── package.json          ← создать при установке Strapi
  └── src/                  ← создаст Strapi
```

## Важно

- `.env` НЕ должен попадать в git (добавьте в `.gitignore`)
- `.env.example` должен быть в git (шаблон для других разработчиков)
- Используйте сильные пароли в production!
