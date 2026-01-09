import Head from 'next/head';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { getCartItems, updateCartItemQty, removeFromCart, type CartItem } from '../lib/utils/cart';
import { getTranslations, getCurrentLocale } from '../lib/utils/translations';

export default function CartV2() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale) || getTranslations('en-CA');

  // Загружаем корзину из localStorage при монтировании
  useEffect(() => {
    const loadCart = () => {
      const cartItems = getCartItems();
      setItems(cartItems);
      setIsLoading(false);
    };

    loadCart();

    // Слушаем обновления корзины из других вкладок/компонентов
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  // Определяем локаль
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateLocale = () => {
        const currentLocale = getCurrentLocale();
        setLocale(currentLocale);
      };
      
      updateLocale();

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

  const money = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const handleQtyInput = (sku: string, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    updateCartItemQty(sku, num);
    // Обновляем локальное состояние
    setItems(getCartItems());
  };

  const handleDecrease = (sku: string) => {
    const item = items.find(i => i.sku === sku);
    if (item) {
      updateCartItemQty(sku, item.qty - 1);
      setItems(getCartItems());
    }
  };

  const handleIncrease = (sku: string) => {
    const item = items.find(i => i.sku === sku);
    if (item) {
      updateCartItemQty(sku, item.qty + 1);
      setItems(getCartItems());
    }
  };

  const handleRemove = (sku: string) => {
    removeFromCart(sku);
    setItems(getCartItems());
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleQuoteSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
        }

    // TODO: здесь потом подключишь Strapi/CRM/SAP
    // например: const formData = new FormData(form); fetch('/api/quote', { method: 'POST', body: formData });
    alert('Quote form is ready. Connect backend/CRM to submit.');
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.cart.pageTitle}</title>
        <meta
          name="description"
          content={t.cart.pageDescription}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/cart-v2.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <>
        <section className="euq8f3-wrap">
          <div className="euq8f3-container">
            <div className="euq8f3-grid">
              {/* LEFT: CART */}
              <div>
                <h1 className="euq8f3-title">{t.cart.title}</h1>

                <div className="euq8f3-head">
                  <div className="euq8f3-th">{t.cart.product}</div>
                  <div className="euq8f3-th">{t.cart.unitPrice}</div>
                  <div className="euq8f3-th" id="euq8f3-th-qty">
                    {t.cart.qty}
                  </div>
                  <div className="euq8f3-th" style={{ textAlign: 'right' }}>
                    {t.cart.subtotal}
                  </div>
                </div>
                <div className="euq8f3-sep"></div>

                {/* Empty state */}
                {!isLoading && items.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    color: '#666'
                  }}>
                    <p style={{ 
                      fontSize: '18px', 
                      fontWeight: 500,
                      marginBottom: '10px'
                    }}>
                      {t.cart.emptyTitle}
                    </p>
                    <p style={{ fontSize: '14px', color: '#999' }}>
                      {t.cart.emptyMessage}
                    </p>
                  </div>
                )}

                {/* Items */}
                {items.map(item => (
                  <div
                    key={item.id}
                    className="euq8f3-row"
                    data-euq8f3-item
                    data-euq8f3-price={item.price}
                  >
                  <div className="euq8f3-prod">
                    <div className="euq8f3-thumb">
                        <img src={item.image} alt={item.name} />
                    </div>
                    <div>
                        <p className="euq8f3-name">
                          {item.name} <span className="euq8f3-brand">{item.brand}</span>
                        </p>
                        <p className="euq8f3-sku">{item.sku}</p>
                    </div>
                </div>

                    <div className="euq8f3-price">{money(item.price)}</div>

                  <div className="confg-product">
                    <div className="euq8f3-qty">
                        <button
                          type="button"
                          className="euq8f3-qtyBtn"
                          aria-label={t.cart.decrease}
                          onClick={() => handleDecrease(item.sku)}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          className="euq8f3-qtyInp"
                          value={item.qty}
                          inputMode="numeric"
                          aria-label={t.cart.quantity}
                          onChange={e => handleQtyInput(item.sku, e)}
                        />
                        <button
                          type="button"
                          className="euq8f3-qtyBtn"
                          aria-label={t.cart.increase}
                          onClick={() => handleIncrease(item.sku)}
                        >
                          +
                        </button>
                    </div>
                      <div
                        className="remove-cart-item"
                        onClick={() => handleRemove(item.sku)}
                        role="button"
                        aria-label={t.cart.removeItem}
                      >
                        <img src="/image/Poubelle.png" alt={t.cart.removeItem} />
                    </div>
                  </div>

                    <div className="euq8f3-sub" data-euq8f3-subtotal>
                      {money(item.price * item.qty)}
                    </div>
                  </div>
                ))}

                {items.length > 0 && (
                  <div className="euq8f3-total">
                    <div className="euq8f3-totalLab">{t.cart.estimatedTotal}</div>
                    <div className="euq8f3-totalVal" id="euq8f3-totalVal">
                      {money(total)}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: REQUEST A QUOTE */}
              <div>
                <h3 className="euq8f3-form-title">{t.cart.requestQuote}</h3>

                <form className="euq8f3-panel" onSubmit={handleQuoteSubmit} noValidate>
                  <div className="euq8f3-field">
                    <label className="euq8f3-label" htmlFor="euq8f3-fn">
                      {t.cart.firstName}
                    </label>
                    <input id="euq8f3-fn" className="euq8f3-input" type="text" required />
                  </div>

                  <div className="euq8f3-field">
                    <label className="euq8f3-label" htmlFor="euq8f3-ln">
                      {t.cart.lastName}
                    </label>
                    <input id="euq8f3-ln" className="euq8f3-input" type="text" required />
                  </div>

                  <div className="euq8f3-field">
                    <label className="euq8f3-label" htmlFor="euq8f3-co">
                      {t.cart.company}
                    </label>
                    <input id="euq8f3-co" className="euq8f3-input" type="text" required />
                  </div>

                  <div className="euq8f3-field">
                    <label className="euq8f3-label" htmlFor="euq8f3-em">
                      {t.cart.email}
                    </label>
                    <input id="euq8f3-em" className="euq8f3-input" type="email" required />
                  </div>

                  <div className="euq8f3-field">
                    <label className="euq8f3-label" htmlFor="euq8f3-ph">
                      {t.cart.phone}
                    </label>
                    <input id="euq8f3-ph" className="euq8f3-input" type="text" required />
                  </div>

                  <div className="euq8f3-field">
                    <div
                      className="euq8f3-captcha"
                      role="img"
                      aria-label="reCAPTCHA placeholder"
                    >
                      <input type="checkbox" id="euq8f3-rc" required />
                      <label htmlFor="euq8f3-rc" style={{ userSelect: 'none' }}>
                        {t.cart.notRobot}
                      </label>
                      <div
                        style={{
                          marginLeft: 'auto',
                          fontSize: '12px',
                          color: '#9CA3AF',
                          textAlign: 'right',
                        }}
                      >
                        {t.cart.recaptcha}
                        <br />
                        {t.cart.privacyTerms}
                      </div>
                    </div>
                  </div>

                  <div className="euq8f3-send">
                    <button className="euq8f3-btn" type="submit">
                      {t.cart.send}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

      </>
    </>
  );
}
