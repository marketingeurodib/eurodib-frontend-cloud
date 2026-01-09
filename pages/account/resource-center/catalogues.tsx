import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { fetchCatalogues, type CatalogEntry } from '@/lib/api/catalogues';
import { getLocaleFromContext } from '@/lib/utils/locale';

interface CatalogPageProps {
  catalogs: CatalogEntry[];
}

export const getServerSideProps: GetServerSideProps<CatalogPageProps> = async (ctx) => {
  // TODO: здесь позже добавишь проверку авторизации
  // Получаем локаль из контекста (cookie, query, header)
  const locale = getLocaleFromContext(ctx);
  const catalogs = await fetchCatalogues(locale);

  return {
    props: {
      catalogs,
    },
  };
};

const AfterLoginPageCatalog: NextPage<CatalogPageProps> = ({ catalogs }) => {
  useEffect(() => {
    const section = document.querySelector('.edbcat-wrapper');
    if (!section) return;

    const selectAll = section.querySelector(
      '.edbcat-select-all-checkbox'
    ) as HTMLInputElement | null;
    const grid = section.querySelector('.edbcat-grid');
    if (!grid) return;

    const columns = Array.from(grid.querySelectorAll('.edbcat-column'));
    const brandCheckboxes = section.querySelectorAll<HTMLInputElement>(
      '.edbcat-filter-checkbox'
    );

    if (!columns.length) return;

    // Сохраняем исходную раскладку
    const initialColumns = columns.map((col) =>
      Array.from(col.querySelectorAll<HTMLElement>('.edbcat-card'))
    );
    const allCards = initialColumns.flat();

    function clearColumns() {
      columns.forEach((col) => {
        col.innerHTML = '';
      });
    }

    function resetSelection() {
      if (selectAll) selectAll.checked = false;
      if (section) {
        section
          .querySelectorAll<HTMLInputElement>('.edbcat-card-input')
          .forEach((cb) => {
            cb.checked = false;
        });
      }
    }

    function restoreInitialLayout() {
      clearColumns();
      initialColumns.forEach((cards, colIndex) => {
        cards.forEach((card) => columns[colIndex].appendChild(card));
      });
    }

    function getActiveBrands() {
      return Array.from(brandCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => (cb.dataset.brand || '').toLowerCase());
    }

    function applyBrandFilter() {
      resetSelection();

      const active = getActiveBrands();

      if (!active.length) {
        restoreInitialLayout();
        return;
      }

      const filtered = allCards.filter((card) =>
        active.includes((card.dataset.brand || '').toLowerCase())
      );

      clearColumns();

      // Заполняем колонки слева направо, сверху вниз
      let colIndex = 0;
      filtered.forEach((card) => {
        columns[colIndex].appendChild(card);
        colIndex = (colIndex + 1) % columns.length;
      });
    }

    // обработчики фильтра брендов
    brandCheckboxes.forEach((cb) => {
      cb.addEventListener('change', applyBrandFilter);
    });

    // Select all – только для текущих видимых карточек
    if (selectAll) {
      selectAll.addEventListener('change', function () {
        const cardCheckboxes = section.querySelectorAll<HTMLInputElement>(
          '.edbcat-card-input'
        );
        cardCheckboxes.forEach((cb) => {
          cb.checked = selectAll.checked;
        });
      });
    }

    // cleanup на размонтирование
    return () => {
      brandCheckboxes.forEach((cb) => {
        cb.removeEventListener('change', applyBrandFilter);
      });
      if (selectAll) {
        selectAll.replaceWith(selectAll.cloneNode(true)); // грубый, но быстрый reset
      }
    };
  }, []);

  // Готовим бренды для фильтра из данных (Strapi → Next)
  const brandMap = new Map<
    string,
    { slug: string; name: string; count: number }
  >();

  catalogs.forEach((cat) => {
    const slug = cat.brandSlug.toLowerCase();
    if (!brandMap.has(slug)) {
      brandMap.set(slug, {
        slug,
        name: cat.brandName,
        count: 1,
      });
    } else {
      const existing = brandMap.get(slug)!;
      existing.count += 1;
    }
  });

  const brandFilters = Array.from(brandMap.values());

  // Раскладываем каталоги по 3 колонкам (визуальная сетка как у тебя)
  const columns: CatalogEntry[][] = [[], [], []];
  catalogs.forEach((cat, index) => {
    columns[index % 3].push(cat);
  });

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
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
        <title>Catalogues | EURODIB</title>
        <meta
          name="description"
          content="Browse Eurodib product catalogues by brand: download PDF catalogs for ATMOVAC, BREMA, Dito Sama, Louis Tellier, UNOX and other professional kitchen equipment brands."
        />
      </Head>

      <section className="edbcat-wrapper">
        <div className="edbcat-container">
          <div className="edbcat-header">
            <h1 className="edbcat-title">Catalogues</h1>
            <p className="edbcat-subtitle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              euismod elementum convallis. Quisque rutrum tortor at elit feugiat
              egestas.
            </p>

            <div className="edbcat-header-actions">
              <label className="edbcat-select-all-label">
                <span>Select all</span>
                <input
                  type="checkbox"
                  className="edbcat-select-all-checkbox"
                />
                <span className="edbcat-checkbox-custom"></span>
              </label>

              <button type="button" className="edbcat-download-btn">
                Download
              </button>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="edbcat-layout">
            {/* FILTERS */}
            <aside className="edbcat-filters">
              <div className="edbcat-filters-toprow">
                <span className="edbcat-filters-title">Filters</span>
                <div className="edbcat-filters-icons">
                  <span className="edbcat-icon-close">×</span>
                  <span className="edbcat-icon-arrow">▴</span>
                </div>
              </div>

              <div className="edbcat-filters-group">
                <div className="edbcat-filters-group-title">Brands</div>

                {brandFilters.map((brand) => (
                  <label key={brand.slug} className="edbcat-filter-item">
                    <span>{brand.name}</span>
                    <span className="edbcat-filter-count">
                      ({brand.count})
                    </span>
                    <input
                      type="checkbox"
                      className="edbcat-filter-checkbox"
                      data-brand={brand.slug}
                    />
                  <span className="edbcat-checkbox-custom"></span>
                </label>
                ))}
              </div>
            </aside>

            {/* THREE COLUMNS OF CATALOGUES */}
            <main className="edbcat-grid">
              {columns.map((colEntries, colIndex) => (
                <div key={colIndex} className="edbcat-column">
                  {colEntries.map((cat) => (
                    <article
                      key={cat.id}
                      className="edbcat-card"
                      data-brand={cat.brandSlug}
                    >
                  <div className="edbcat-card-image">
                        <img src={cat.thumbUrl} alt={`${cat.brandName} ${cat.year}`} />
                  </div>
                  <div className="edbcat-card-body">
                        <div className="edbcat-card-name">{cat.brandName}</div>
                        <div className="edbcat-card-year">{cat.year}</div>
                  </div>
                  <label className="edbcat-card-checkbox">
                        <input
                          type="checkbox"
                          className="edbcat-card-input"
                          data-file-url={cat.fileUrl}
                        />
                    <span className="edbcat-checkbox-custom"></span>
                  </label>
                </article>
                  ))}
                  </div>
              ))}
            </main>
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

export default AfterLoginPageCatalog;
