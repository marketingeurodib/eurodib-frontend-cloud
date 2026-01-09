// components/layout/MainLayout.tsx
// Единый layout для всех страниц: Header + Footer + EmailSignup
// Используется в _app.tsx для всех страниц по умолчанию

import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import EmailSignup from './EmailSignup';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  
  // Скрываем EmailSignup на страницах account (они могут иметь свой EmailSignup внутри)
  const isAccountPage = router.pathname.startsWith('/account');
  const showEmailSignup = !isAccountPage;

  return (
    <>
      <Header />
      <main>{children}</main>
      {showEmailSignup && <EmailSignup />}
      <Footer />
    </>
  );
}
