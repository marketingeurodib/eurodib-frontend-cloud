// components/Layout.tsx
// NOTE: This component is not currently used. MainLayout is used instead via _app.tsx

import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './layout/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

