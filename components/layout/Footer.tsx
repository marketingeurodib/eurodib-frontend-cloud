// components/Footer.tsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

export default function Footer() {
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
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-logo">
          <img
            src="https://eurodib.com/wp-content/uploads/2020/08/eurodib_logo_footer@2x.png"
            alt="Eurodib Logo"
          />
          <p>{t.footer.description}</p>
          <div className="social-icons">
            <a href="#">
              <img src="/image/LinkedIn_white 1.png" alt="Linkedin" />
            </a>
            <a href="#">
              <img src="/image/Facebook_white.png" alt="Facebook" />
            </a>
            <a href="#">
              <img src="/image/Instagram_white 1.png" alt="Instagram" />
            </a>
            <a href="#">
              <img src="/image/Youtube_white.png" alt="Youtube" />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <ul>
              <li><Link href="/about-us">{t.footer.ourStory}</Link></li>
              <li><Link href="/brands">{t.footer.ourBrands}</Link></li>
              <li><Link href="/our-reps">{t.footer.ourReps}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <ul>
              <li><Link href="/where-to-buy">{t.footer.whereToBuy}</Link></li>
              <li><Link href="/become-a-dealer">{t.footer.becomeADealer}</Link></li>
              <li><a href="#">{t.footer.ourPolicies}</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <ul>
              <li><Link href="/careers/career">{t.footer.careers}</Link></li>
              <li><Link href="/news">{t.footer.latestNews}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <Link href="/contact-us" className="footer-btn">
              {t.footer.contactUs}
            </Link>
            <Link href="/parts-service" className="footer-btn outline">
              {t.footer.partsService}
            </Link>
            <ul className="quick-links"></ul>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>{t.footer.copyright}</p>
        <div className="policy-links">
          <Link href="/terms-and-conditions">{t.footer.termsAndConditions}</Link> |{' '}
          <a href="#">{t.footer.privacyPolicy}</a> |{' '}
          <a href="#">{t.footer.cookiePreferences}</a> |{' '}
          <a href="#">{t.footer.sitemap}</a>
        </div>
      </div>
    </footer>
  );
}

