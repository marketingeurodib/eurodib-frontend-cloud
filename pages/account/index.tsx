import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import AccountLayout from '../../components/account/AccountLayout';
import { fetchUserProfile, type UserProfile } from '../../lib/api/profile';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

interface ProfileUserProps {
  profile: UserProfile;
}

export const getServerSideProps: GetServerSideProps<ProfileUserProps> = async (ctx) => {
  // TODO: здесь позже возьмёшь userId из сессии / токена (NextAuth, custom auth и т.д.)
  // const userId = getUserIdFromSession(ctx.req);

  // Если пользователь не авторизован — можно будет сделать redirect на /auth/sign-in
  // if (!userId) {
  //   return {
  //     redirect: {
  //       destination: '/auth/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  const profile = await fetchUserProfile();

  return {
    props: {
      profile,
    },
  };
};

export default function ProfileUser({ profile }: ProfileUserProps) {
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
    // TODO: здесь позже добавишь очистку сессии/токена
    // Например: await fetch('/api/auth/signout', { method: 'POST' });
    // или: signOut() из NextAuth
    
    // Редирект на страницу входа
    router.push('/auth/sign-in');
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
        />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>{t.account.pageTitle}</title>
        <meta
          name="description"
          content={t.account.pageDescription}
        />
      </Head>

      <Breadcrumbs
        items={[
          { label: t.account.home, href: '/' },
          { label: t.account.userProfile },
        ]}
        className="eurodib-profile-breadcrumbs"
      />

      <AccountLayout onSignOut={handleSignOut}>
        <div className="eurodib-profile-grid">
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.firstName}</div>
            <div className="eurodib-profile-value">{profile.firstName}</div>
          </div>
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.lastName}</div>
            <div className="eurodib-profile-value">{profile.lastName}</div>
          </div>

          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.companyName}</div>
            <div className="eurodib-profile-value">{profile.companyName}</div>
          </div>
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.preferredLanguage}</div>
            <div className="eurodib-profile-value">
              {profile.preferredLanguage}
            </div>
          </div>

          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.email}</div>
            <div className="eurodib-profile-value">{profile.email}</div>
          </div>
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.phone}</div>
            <div className="eurodib-profile-value">{profile.phone}</div>
          </div>

          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.address}</div>
            <div className="eurodib-profile-value">{profile.address}</div>
          </div>
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.city}</div>
            <div className="eurodib-profile-value">{profile.city}</div>
          </div>

          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.province}</div>
            <div className="eurodib-profile-value">{profile.province}</div>
          </div>
          <div className="eurodib-profile-field">
            <div className="eurodib-profile-label">{t.account.postalCode}</div>
            <div className="eurodib-profile-value">{profile.postalCode}</div>
          </div>

          <div className="eurodib-profile-field eurodib-profile-field--full">
            <div className="eurodib-profile-label">{t.account.country}</div>
            <div className="eurodib-profile-value">{profile.country}</div>
          </div>
        </div>

        {/* Edit area — пока просто текст, который можно будет отправлять в CRM/Strapi */}
        <div className="eurodib-profile-edit">
          <div className="eurodib-profile-label eurodib-profile-label--edit">
            {t.account.editProfile}
          </div>
          <div className="eurodib-profile-textarea-wrap">
            <textarea
              className="eurodib-profile-textarea"
              placeholder={t.account.editPlaceholder}
            ></textarea>
          </div>

          <button className="eurodib-profile-send-btn">{t.account.send}</button>
        </div>
      </AccountLayout>
    </>
  );
}

