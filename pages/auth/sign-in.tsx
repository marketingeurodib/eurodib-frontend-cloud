import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  
  // Инициализируем переводы с дефолтной локалью, затем обновим при монтировании
  // Используем fallback на случай, если переводы не загружены
  const t = getTranslations(locale) || getTranslations('en-CA');

  useEffect(() => {
    // Устанавливаем локаль только на клиенте
    if (typeof window !== 'undefined') {
      const updateLocale = () => {
        const currentLocale = getCurrentLocale();
        setLocale(currentLocale);
      };
      
      updateLocale();

      // Обновляем локаль при изменении cookie (для синхронизации между вкладками)
      window.addEventListener('storage', updateLocale);
      window.addEventListener('focus', updateLocale);
      
      // Обновляем локаль при изменении URL (query параметр locale)
      const handleRouteChange = () => {
        updateLocale();
      };
      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        window.removeEventListener('storage', updateLocale);
        window.removeEventListener('focus', updateLocale);
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router]);
  
  // Также обновляем локаль при изменении query параметра
  useEffect(() => {
    if (router.query.locale) {
      const currentLocale = getCurrentLocale();
      setLocale(currentLocale);
    }
  }, [router.query.locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage(t.signIn.errorFillFields);
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: заменить на реальный вызов авторизации (Next API → Strapi / CRM / SAP SSO)
      // Пример:
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, rememberMe }),
      // });
      // if (!res.ok) { ...обработка ошибки... }

      alert('Sign-in form is ready. Connect it to your auth/CRM backend.');
    } catch (err) {
      console.error('Sign-in error', err);
      setErrorMessage(t.signIn.errorUnableToSignIn);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
        <title>{t.signIn.pageTitle}</title>
        <meta
          name="description"
          content={t.signIn.pageDescription}
        />
      </Head>

      <>
        <section className="eurodib-signin-section">
          <div className="eurodib-signin-inner">
            {/* Левая колонка */}
            <div className="eurodib-signin-left">
              <h1 className="eurodib-signin-title">{t.signIn.title}</h1>
              <p className="eurodib-signin-subtitle">
                {t.signIn.subtitle}
              </p>

              <form className="eurodib-signin-form" onSubmit={handleSubmit} noValidate>
                <label className="eurodib-signin-label">
                  {t.signIn.emailLabel}<span className="eurodib-signin-required">*</span>
                  <div className="eurodib-signin-input-wrap">
                    <input
                      type="email"
                      className="eurodib-signin-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="eurodib-signin-label">
                  {t.signIn.passwordLabel}<span className="eurodib-signin-required">*</span>
                  <div className="eurodib-signin-input-wrap eurodib-signin-input-wrap--password">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="eurodib-signin-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className={`eurodib-signin-eye ${showPassword ? 'eurodib-signin-eye--open' : 'eurodib-signin-eye--closed'}`}
                      aria-label={showPassword ? t.signIn.hidePassword : t.signIn.showPassword}
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                </label>

                <div className="eurodib-signin-remember-row">
                  <label className="eurodib-signin-remember">
                    <input
                      type="checkbox"
                      className="eurodib-signin-remember-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="eurodib-signin-remember-custom"></span>
                    <span className="eurodib-signin-remember-text">{t.signIn.rememberMe}</span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="eurodib-signin-error">{errorMessage}</div>
                )}

                <button
                  type="submit"
                  className="eurodib-signin-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.signIn.signingIn : t.signIn.signInButton}
                </button>

                <div className="eurodib-signin-forgot">
                  <Link href="/auth/forgot" className="eurodib-signin-forgot-link">
                    {t.signIn.forgotPassword}
                  </Link>
                </div>
              </form>
            </div>

            {/* Правая колонка */}
            <aside className="eurodib-signin-right">
              <h2 className="eurodib-signin-right-title">
                {t.signIn.noAccountTitle}
              </h2>
              <p className="eurodib-signin-right-subtitle">{t.signIn.advantages}</p>

              <div className="eurodib-signin-advantages">
                <div className="eurodib-signin-advantage">
                  <div className="eurodib-signin-advantage-icon eurodib-signin-advantage-icon--cart">
                    <img src="/image/Order-icon.png" alt="" />
                  </div>
                  <p className="eurodib-signin-advantage-text">
                    {t.signIn.advantageOrder}
                  </p>
                </div>

                <div className="eurodib-signin-advantage">
                  <div className="eurodib-signin-advantage-icon eurodib-signin-advantage-icon--download">
                    <img src="/image/Download-icon.png" alt="" />
                  </div>
                  <p className="eurodib-signin-advantage-text">
                    {t.signIn.advantageDownload}
                  </p>
                </div>

                <div className="eurodib-signin-advantage">
                  <div className="eurodib-signin-advantage-icon ">
                    <img src="/image/Training-icon.png" alt="" />
                  </div>
                  <p className="eurodib-signin-advantage-text">
                    {t.signIn.advantageTraining}
                  </p>
                </div>

                <div className="eurodib-signin-advantage">
                  <div className="eurodib-signin-advantage-icon">
                    <img src="/image/Price-discount-icon.png" alt="" />
                  </div>
                  <p className="eurodib-signin-advantage-text">
                    {t.signIn.advantageDiscounts}
                  </p>
                </div>
              </div>

              <Link href="/auth/create-account" className="eurodib-signin-create-btn">
                {t.signIn.createAccount}
              </Link>
            </aside>
          </div>
        </section>
      </>

    </>
  );
}

