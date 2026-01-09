# Layout Components

Единый layout-слой для всего сайта.

## Структура

```
/components
  /layout
    Header.tsx          - Шапка сайта (навигация, поиск, корзина)
    Footer.tsx          - Подвал сайта (ссылки, соцсети)
    EmailSignup.tsx     - Форма подписки на email
    MainLayout.tsx      - Обертка: Header + main + EmailSignup + Footer
  /account
    AccountLayout.tsx   - Layout для страниц аккаунта (с сайдбаром)
    AccountSidebar.tsx  - Боковое меню аккаунта
```

## Использование

### MainLayout

Подключен в `_app.tsx` и применяется ко всем страницам автоматически:

```tsx
// pages/_app.tsx
import MainLayout from '../components/layout/MainLayout';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
```

**Особенности:**
- EmailSignup автоматически скрывается на страницах `/account/*`
- Header и Footer всегда отображаются

### AccountLayout

Используется внутри страниц `/account/*`:

```tsx
// pages/account/index.tsx
import AccountLayout from '../../components/account/AccountLayout';

export default function ProfilePage() {
  return (
    <AccountLayout onSignOut={handleSignOut}>
      {/* Контент страницы */}
    </AccountLayout>
  );
}
```

**Важно:**
- AccountLayout оборачивает только контент страницы
- MainLayout (Header + Footer) уже применен через `_app.tsx`
- Не нужно дублировать EmailSignup в страницах account - он скрыт автоматически

## Правила

1. **Не импортируйте Header/Footer/EmailSignup напрямую в страницах** - они уже в MainLayout
2. **Для страниц account используйте AccountLayout** - он добавляет сайдбар
3. **Breadcrumbs можно использовать** - они не входят в MainLayout
