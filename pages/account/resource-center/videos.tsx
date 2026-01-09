import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import { fetchVideos, type VideoItem } from '@/lib/api/videos';
import { getLocaleFromContext } from '@/lib/utils/locale';

interface VideosPageProps {
  videos: VideoItem[];
}

export const getServerSideProps: GetServerSideProps<VideosPageProps> = async (ctx) => {
  // TODO: 1) Проверка авторизации
  // Пример (когда подключишь NextAuth или свою auth-систему):
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
  const videos = await fetchVideos(locale);

  return {
    props: {
      videos,
    },
  };
};

const AfterLoginPageVideo: NextPage<VideosPageProps> = ({ videos }) => {
  useEffect(() => {
    // Используем setTimeout чтобы убедиться, что DOM обновился после рендера
    let timeoutId: NodeJS.Timeout;
    let cleanupFunctions: Array<() => void> = [];

    timeoutId = setTimeout(() => {
      const selectAll = document.querySelector(
        '.edbvid-select-all-input'
      ) as HTMLInputElement | null;
      const cardCheckboxes = document.querySelectorAll(
        '.edbvid-card-checkbox'
      ) as NodeListOf<HTMLInputElement>;
      const filterCheckboxes = document.querySelectorAll(
        '.edbvid-filter-checkbox'
      ) as NodeListOf<HTMLInputElement>;
      const cards = document.querySelectorAll(
        '.edbvid-card'
      ) as NodeListOf<HTMLElement>;

      if (!cards.length || !filterCheckboxes.length) {
        console.warn('[VIDEOS FILTER] Не найдены элементы для фильтрации');
        return;
      }

      // блокируем сабмит поиска
      const searchForm = document.querySelector('.edbvid-search');
      if (searchForm) {
        const handleSubmit = (e: Event) => {
          e.preventDefault();
        };
        searchForm.addEventListener('submit', handleSubmit);
        cleanupFunctions.push(() => {
          searchForm.removeEventListener('submit', handleSubmit);
        });
      }

      // Select all
      if (selectAll) {
        const handleSelectAll = () => {
          cardCheckboxes.forEach((cb) => {
            cb.checked = selectAll.checked;
          });
        };
        selectAll.addEventListener('change', handleSelectAll);
        cleanupFunctions.push(() => {
          selectAll.removeEventListener('change', handleSelectAll);
        });
      }

      // Обновление состояния Select all
      const handleCardChange = () => {
        const allChecked = Array.from(cardCheckboxes).every((c) => c.checked);
        const noneChecked = Array.from(cardCheckboxes).every((c) => !c.checked);
        if (selectAll) {
          if (allChecked) {
            selectAll.checked = true;
          } else if (noneChecked) {
            selectAll.checked = false;
          } else {
            selectAll.checked = false;
          }
        }
      };

      cardCheckboxes.forEach((cb) => {
        cb.addEventListener('change', handleCardChange);
        cleanupFunctions.push(() => {
          cb.removeEventListener('change', handleCardChange);
        });
      });

      // Фильтрация по категориям и брендам
      function applyVideoFilters() {
        const activeCats = Array.from(filterCheckboxes)
          .filter((cb) => cb.checked && cb.dataset.cat)
          .map((cb) => (cb.dataset.cat || '').toLowerCase().trim());

        const activeBrands = Array.from(filterCheckboxes)
          .filter((cb) => cb.checked && cb.dataset.brand)
          .map((cb) => (cb.dataset.brand || '').toLowerCase().trim());

        let visibleCount = 0;

        cards.forEach((card) => {
          const cardCat = (card.dataset.cat || '').toLowerCase().trim();
          const cardBrand = (card.dataset.brand || '').toLowerCase().trim();

          const catMatch = activeCats.length === 0 || activeCats.includes(cardCat);
          const brandMatch =
            activeBrands.length === 0 || activeBrands.includes(cardBrand);

          if (catMatch && brandMatch) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Обновляем счетчик видимых файлов
        const filesCountEl = document.querySelector('.edbvid-files-count');
        if (filesCountEl) {
          filesCountEl.textContent = `${visibleCount} files`;
        }

        console.log(`[VIDEOS FILTER] Применены фильтры: ${activeCats.length} категорий, ${activeBrands.length} брендов. Видимо: ${visibleCount} из ${cards.length}`);
      }

      // Применяем фильтры при изменении
      filterCheckboxes.forEach((cb) => {
        cb.addEventListener('change', applyVideoFilters);
        cleanupFunctions.push(() => {
          cb.removeEventListener('change', applyVideoFilters);
        });
      });

      // Применяем фильтры сразу при загрузке
      applyVideoFilters();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [videos]);

  // Динамически генерируем фильтры из реальных данных
  const categoryMap = new Map<string, number>();
  const brandMap = new Map<string, number>();

  videos.forEach((video) => {
    // Фильтруем только непустые значения
    if (video.categorySlug && video.categorySlug.trim()) {
      const cat = video.categorySlug.toLowerCase().trim();
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    }
    if (video.brandSlug && video.brandSlug.trim()) {
      const brand = video.brandSlug.toLowerCase().trim();
      brandMap.set(brand, (brandMap.get(brand) || 0) + 1);
    }
  });

  const categories = Array.from(categoryMap.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const brands = Array.from(brandMap.entries())
    .map(([slug, count]) => ({
      slug,
      name: slug
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalFiles = videos.length;
  const totalSizeMb = videos.reduce((sum, v) => sum + (v.sizeMb || 0), 0);
  const totalSizeFormatted = `${totalSizeMb.toFixed(1)} MB`;

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
        <title>Videos | EURODIB</title>
        <meta
          name="description"
          content="Access Eurodib product videos: training materials, demonstrations and tutorials for professional kitchen equipment."
        />
      </Head>

      {/* ===== VIDEOS SECTION ===== */}
      <section className="edbvid-wrapper">
        <div className="edbvid-container">
          {/* HEADER */}
          <header className="edbvid-header">
            <h1 className="edbvid-title">Videos</h1>

            {/* Поисковая строка */}
            <form className="edbvid-search" action="#" role="search">
              <input
                type="search"
                className="edbvid-search-input"
                placeholder="Type in the SKU you are looking for"
                aria-label="Search videos"
              />
              <button
                type="submit"
                className="edbvid-search-btn"
                aria-label="Search"
              >
                <span className="edbvid-search-icon">
                  {/* иконка лупы */}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6" strokeWidth="2"></circle>
                    <line
                      x1="16"
                      y1="16"
                      x2="21"
                      y2="21"
                      strokeWidth="2"
                    ></line>
                  </svg>
                </span>
              </button>
            </form>

            {/* Select all / files / Download */}
            <div className="edbvid-header-bar">
              <label className="edbvid-select-all-label">
                <span>Select all</span>
                <input
                  type="checkbox"
                  className="edbvid-select-all-input"
                />
                <span className="edbvid-checkbox-custom"></span>
              </label>

              <div className="edbvid-files-info">
                <span className="edbvid-files-count">
                  {totalFiles} files
                </span>
                <span className="edbvid-files-size"> / {totalSizeFormatted}</span>
              </div>

              <button type="button" className="edbvid-download-btn">
                Download
              </button>
            </div>
          </header>

          {/* MAIN LAYOUT */}
          <div className="edbvid-layout">
            {/* FILTERS */}
            <aside className="edbvid-filters">
              <div className="edbvid-filters-toprow">
                <span className="edbvid-filters-title">Filters</span>
                <div className="edbvid-filters-icons">
                  <span className="edbvid-icon-close">×</span>
                  <span className="edbvid-icon-arrow">▴</span>
                </div>
              </div>

              {/* Categories - динамически генерируем из данных */}
              <div className="edbvid-filter-group">
                <button
                  type="button"
                  className="edbvid-filter-group-header"
                >
                  <span>Categories</span>
                  <span className="edbvid-filter-group-arrow">▴</span>
                </button>
                <div className="edbvid-filter-group-body">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <label key={category.slug} className="edbvid-filter-item">
                        <span>{category.name}</span>
                        <span className="edbvid-filter-count">({category.count})</span>
                        <input
                          type="checkbox"
                          className="edbvid-filter-checkbox"
                          data-cat={category.slug}
                        />
                        <span className="edbvid-checkbox-custom"></span>
                      </label>
                    ))
                  ) : (
                    <div className="edbvid-filter-item">
                      <span>No categories available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Brands - динамически генерируем из данных */}
              <div className="edbvid-filter-group">
                <button
                  type="button"
                  className="edbvid-filter-group-header"
                >
                  <span>Brands</span>
                  <span className="edbvid-filter-group-arrow">▴</span>
                </button>
                <div className="edbvid-filter-group-body">
                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <label key={brand.slug} className="edbvid-filter-item">
                        <span>{brand.name}</span>
                        <span className="edbvid-filter-count">({brand.count})</span>
                        <input
                          type="checkbox"
                          className="edbvid-filter-checkbox"
                          data-brand={brand.slug}
                        />
                        <span className="edbvid-checkbox-custom"></span>
                      </label>
                    ))
                  ) : (
                    <div className="edbvid-filter-item">
                      <span>No brands available</span>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* VIDEOS GRID */}
            <main className="edbvid-grid">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="edbvid-card"
                  data-cat={video.categorySlug?.toLowerCase().trim() || ''}
                  data-brand={video.brandSlug?.toLowerCase().trim() || ''}
                >
                  <div className="edbvid-thumb-wrapper">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                    />
                    <button
                      type="button"
                      className="edbvid-play-btn"
                      aria-label={`Play video for ${video.title}`}
                      onClick={() => {
                        // тут позже можно открыть модалку/плеер по video.videoUrl
                        if (video.videoUrl && video.videoUrl !== '#') {
                          window.open(video.videoUrl, '_blank');
                        }
                      }}
                    >
                      <span className="edbvid-play-circle">
                        <span className="edbvid-play-triangle"></span>
                      </span>
                    </button>
                  </div>
                  <div className="edbvid-card-title">
                    {video.title}
                  </div>
                  <label className="edbvid-card-checkbox-wrap">
                    <input
                      type="checkbox"
                      className="edbvid-card-checkbox"
                    />
                    <span className="edbvid-checkbox-custom"></span>
                  </label>
                </article>
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

export default AfterLoginPageVideo;
