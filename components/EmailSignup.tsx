import { FormEvent, useState, useEffect } from 'react';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

export default function EmailSignup() {
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale);

  useEffect(() => {
    const updateLocale = () => {
      setLocale(getCurrentLocale());
    };
    
    updateLocale();

    // Обновляем локаль при изменении cookie (для синхронизации между вкладками)
    window.addEventListener('storage', updateLocale);
    window.addEventListener('focus', updateLocale);

    return () => {
      window.removeEventListener('storage', updateLocale);
      window.removeEventListener('focus', updateLocale);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: здесь позже подключишь отправку email на backend/Strapi
    // const formData = new FormData(e.currentTarget);
    // const email = formData.get('email');
    // await fetch('/api/email-signup', { method: 'POST', body: JSON.stringify({ email }) });
  };

  return (
    <section className="custom-email-signup">
      <div className="custom-signup-wrapper">
        <h3 className="custom-signup-title">
          {t.emailSignup.title}
        </h3>
        <form className="custom-signup-form" onSubmit={handleSubmit}>
          <input type="email" placeholder={t.emailSignup.emailPlaceholder} required />
          <button type="submit">{t.emailSignup.buttonText}</button>
        </form>
      </div>
    </section>
  );
}

