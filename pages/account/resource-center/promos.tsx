import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { fetchPromos, type PromoItem } from '@/lib/api/promos';
import { getLocaleFromContext } from '@/lib/utils/locale';

interface PromosPageProps {
  promos: PromoItem[];
}

export const getServerSideProps: GetServerSideProps<PromosPageProps> = async (ctx) => {
  // 1) Проверка авторизации (заглушка)
  // Пример, когда подключишь NextAuth или свою систему:
  //
  // const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  // Получаем локаль из контекста (cookie, query, header)
  const locale = getLocaleFromContext(ctx);
  const promos = await fetchPromos(locale);

  return {
    props: {
      promos,
    },
  };
};

const AfterLoginPagePromo: NextPage<PromosPageProps> = ({ promos }) => {
  useEffect(() => {
    const selectAll = document.querySelector(
      '.edbpromo-select-all-input'
    ) as HTMLInputElement | null;

    const cardCheckboxes = document.querySelectorAll(
      '.edbpromo-card-checkbox'
    ) as NodeListOf<HTMLInputElement>;

    if (!selectAll || !cardCheckboxes.length) return;

    // Select all -> все карточки
    const onSelectAllChange = () => {
      cardCheckboxes.forEach((cb) => {
        cb.checked = selectAll.checked;
      });
    };

    selectAll.addEventListener('change', onSelectAllChange);

    // Любая карточка -> обновить Select all
    const onCardChange = () => {
      const allChecked = Array.from(cardCheckboxes).every((c) => c.checked);
      const noneChecked = Array.from(cardCheckboxes).every((c) => !c.checked);

      if (allChecked) {
        selectAll.checked = true;
      } else if (noneChecked) {
        selectAll.checked = false;
      } else {
        // промежуточное состояние — просто убираем галочку
        selectAll.checked = false;
      }
    };

    cardCheckboxes.forEach((cb) => {
      cb.addEventListener('change', onCardChange);
    });

    // очистка слушателей при размонтировании (на всякий случай)
    return () => {
      selectAll.removeEventListener('change', onSelectAllChange);
      cardCheckboxes.forEach((cb) => cb.removeEventListener('change', onCardChange));
    };
  }, [promos.length]);

  const totalFiles = promos.length;
  const totalSizeMb = promos.reduce((sum, p) => sum + (p.sizeMb || 0), 0);
  const totalSizeFormatted = totalSizeMb ? `${totalSizeMb.toFixed(1)} MB` : '';

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
        <title>Promos | EURODIB</title>
        <meta
          name="description"
          content="Access Eurodib promotional materials: special deals, seasonal offers and marketing flyers for authorized dealers."
        />
      </Head>

      {/* ===== PROMOS SECTION ===== */}
      <section className="edbpromo-wrapper">
        <div className="edbpromo-container">
          {/* Header */}
          <div className="edbpromo-header">
            <h2 className="edbpromo-title">Promos</h2>
            <p className="edbpromo-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod
              elementum convallis. Quisque rutrum tortor at elit feugiat egestas.
            </p>

            <div className="edbpromo-header-actions">
              <label className="edbpromo-select-all-label">
                <span>Select all</span>
                <input type="checkbox" className="edbpromo-select-all-input" />
                <span className="edbpromo-checkbox-custom"></span>
              </label>

              {/* Можно позже повесить реальную логику скачивания выбранных промо */}
              <button
                type="button"
                className="edbpromo-download-btn"
                onClick={() => {
                  // TODO: собрать выбранные карточки и скачать файлы (fileUrl) пачкой
                }}
              >
                Download
              </button>
            </div>

            {/* Инфа о количестве файлов (по желанию, можно убрать/изменить) */}
            {totalFiles > 0 && (
              <div className="edbpromo-files-meta">
                <span>{totalFiles} files</span>
                {totalSizeFormatted && <span> / {totalSizeFormatted}</span>}
              </div>
            )}
          </div>

          {/* Promos list */}
          <div className="edbpromo-list">
            {promos.map((promo) => (
              <article key={promo.id} className="edbpromo-card">
                <div className="edbpromo-thumb">
                  <img src={promo.thumbUrl} alt={promo.title} />
                </div>
                <div className="edbpromo-info">
                  <div className="edbpromo-card-title">{promo.title}</div>
                  <div className="edbpromo-card-dates">
                    {promo.dateFrom}
                    <br />
                    to {promo.dateTo}
                  </div>
                </div>
                <label className="edbpromo-card-checkbox-wrap">
                  <input type="checkbox" className="edbpromo-card-checkbox" />
                  <span className="edbpromo-checkbox-custom"></span>
                </label>
              </article>
            ))}
          </div>
        </div>
      </section>


      <Script
        src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
};

export default AfterLoginPagePromo;
