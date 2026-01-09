import { useState, useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { fetchOrders, type Order, type OrderItem } from '../../lib/api/orders';
import AccountLayout from '../../components/account/AccountLayout';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

interface AfterLoginPageOrdersProps {
  orders: Order[];
}

export const getServerSideProps: GetServerSideProps<AfterLoginPageOrdersProps> = async () => {
  // TODO: здесь будет:
  // 1) Проверка авторизации
  // 2) Получение customerId из сессии
  // const customerId = getCustomerIdFromSession(ctx.req);
  const orders = await fetchOrders();

  return {
    props: {
      orders,
    },
  };
};

const AfterLoginPageOrders: NextPage<AfterLoginPageOrdersProps> = ({ orders }) => {
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

  const handleReorder = async (item: OrderItem) => {
    try {
      // Здесь будет связь с корзиной / backend.
      // Например: /api/cart/add -> дальше Strapi/SAP.
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: item.sku,
          qty: item.qty,
          // можно прокидывать дополнительные идентификаторы
          sapOrderLineId: item.sapOrderLineId,
          source: 'previous-orders',
        }),
      });

      if (!res.ok) {
        // Можно логировать на бэке
        console.error('Failed to add to cart', await res.text());
        alert('Unable to add this item to cart. Please try again.');
        return;
      }

      // Опционально: можно вернуть обновлённое состояние корзины
      // const data = await res.json();

      alert(`Item ${item.sku} has been added to your cart.`);
      // Или редирект в корзину:
      // router.push('/cart');
    } catch (error) {
      console.error('Reorder error', error);
      alert('Unexpected error while adding item to cart.');
    }
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
        <title>{t.account.ordersPageTitle}</title>
        <meta
          name="description"
          content={t.account.ordersPageDescription}
        />
      </Head>

      <AccountLayout>
        <section className="edborders-wrapper">
          <div className="edborders-container">
            <h2 className="edborders-title">{t.account.ordersTitle}</h2>

            {orders.length === 0 ? (
              <div className="edborders-empty">
                <p className="edborders-empty-title">{t.account.noOrders}</p>
                <p className="edborders-empty-message">{t.account.noOrdersMessage}</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="edborders-order-block">
                  <div className="edborders-order-header">
                    <span>
                      {t.account.orderPlacedOn} {order.placedOn}
                      {order.orderNumber ? ` · ${order.orderNumber}` : ''}
                    </span>
                    <span>{t.account.qty}</span>
                  </div>

                  {order.items.map((item) => (
                    <div key={item.id} className="edborders-order-item">
                      <div className="edborders-item-left">
                        <img src={item.imageUrl} alt={item.name} />
                        <div className="edborders-item-info">
                          <div className="edborders-item-name">
                            {item.name} <strong>{item.brand}</strong>
                          </div>
                          <div className="edborders-item-sku">{item.sku}</div>
                        </div>
                      </div>

                      <div className="edborders-item-qty">{item.qty}</div>
                      <button
                        className="edborders-reorder-btn"
                        type="button"
                        onClick={() => handleReorder(item)}
                      >
                        {t.account.reorder}
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      </AccountLayout>


      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
};

export default AfterLoginPageOrders;
