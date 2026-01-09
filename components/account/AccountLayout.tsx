// components/account/AccountLayout.tsx
// Layout для страниц аккаунта с сайдбаром

import type { ReactNode } from 'react';
import AccountSidebar from './AccountSidebar';

interface AccountLayoutProps {
  children: ReactNode;
  onSignOut?: () => void;
}

export default function AccountLayout({ children, onSignOut }: AccountLayoutProps) {
  return (
    <section className="eurodib-profile-section">
      <div className="eurodib-profile-inner">
        <div className="eurodib-profile-layout">
          <AccountSidebar onSignOut={onSignOut} />
          <div className="eurodib-profile-card">{children}</div>
        </div>
      </div>
    </section>
  );
}
