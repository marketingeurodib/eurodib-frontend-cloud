// components/account/AccountSidebar.tsx
// Боковое меню для страниц аккаунта

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

interface AccountSidebarProps {
  onSignOut?: () => void;
}

export default function AccountSidebar({ onSignOut }: AccountSidebarProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateLocale = () => {
        const currentLocale = getCurrentLocale();
        setLocale(currentLocale);
      };
      
      updateLocale();

      window.addEventListener('storage', updateLocale);
      window.addEventListener('focus', updateLocale);

      return () => {
        window.removeEventListener('storage', updateLocale);
        window.removeEventListener('focus', updateLocale);
      };
    }
  }, []);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      // Дефолтная логика выхода
      // TODO: здесь позже добавишь очистку сессии/токена
      router.push('/auth/sign-in');
    }
  };

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  return (
    <nav className="eurodib-profile-sidebar">
      <ul className="eurodib-profile-menu">
        <li
          className={`eurodib-profile-menu-item ${
            isActive('/account') && !isActive('/account/orders') && !isActive('/account/resource-center') && !isActive('/account/book-a-training')
              ? 'eurodib-profile-menu-item--active'
              : ''
          }`}
        >
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--user">
            <img src="/image/Group-264.png" alt="" />
          </span>
          <Link href="/account" className="eurodib-profile-menu-text">
            {t.account.profile}
          </Link>
        </li>

        <li className="eurodib-profile-menu-item">
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--cart">
            <img src="/image/Layer_111.png" alt="" />
          </span>
          <Link href="/cart" className="eurodib-profile-menu-text">
            {t.account.placeOrder}
          </Link>
        </li>

        <li
          className={`eurodib-profile-menu-item ${
            isActive('/account/orders') ? 'eurodib-profile-menu-item--active' : ''
          }`}
        >
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--cart-history">
            <img src="/image/Cart-history.png" alt="" />
          </span>
          <Link href="/account/orders" className="eurodib-profile-menu-text">
            {t.account.previousOrders}
          </Link>
        </li>

        <li
          className={`eurodib-profile-menu-item ${
            isActive('/account/resource-center') ? 'eurodib-profile-menu-item--active' : ''
          }`}
        >
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--download">
            <img src="/image/Layer_1222.png" alt="" />
          </span>
          <Link href="/account/resource-center" className="eurodib-profile-menu-text">
            {t.account.resourceCenter}
          </Link>
        </li>

        <li
          className={`eurodib-profile-menu-item ${
            isActive('/account/book-a-training') ? 'eurodib-profile-menu-item--active' : ''
          }`}
        >
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--training">
            <img src="/image/Layer_1555.png" alt="" />
          </span>
          <Link href="/account/book-a-training" className="eurodib-profile-menu-text">
            {t.account.bookTraining}
          </Link>
        </li>

        <li className="eurodib-profile-menu-item">
          <span className="eurodib-profile-menu-icon eurodib-profile-menu-icon--signout">
            <img src="/image/Layer_3331.png" alt="" />
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="eurodib-profile-menu-text"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              cursor: 'pointer',
              color: 'inherit',
              textAlign: 'left',
              width: '100%',
            }}
          >
            {t.account.signOut}
          </button>
        </li>
      </ul>
    </nav>
  );
}
