import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';


export default function AfterLoginPageProducts() {
  useEffect(() => {
    // Переключение групп фильтров
    document.querySelectorAll('.edbpp-filter-group-header').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const group = btn.closest('.edbpp-filter-group');
        if (group) {
          group.classList.toggle('edbpp-filter-group--open');
        }
      });
    });

    // Select all
    const selectAllCheckbox = document.querySelector('.edbpp-select-all-checkbox') as HTMLInputElement;
    const cardCheckboxes = document.querySelectorAll('.edbpp-card-input');
    const filesCountEl = document.querySelector('.edbpp-files-count');

    function updateFilesCount() {
      if (filesCountEl) {
        const selected = Array.from(cardCheckboxes).filter((cb) => (cb as HTMLInputElement).checked).length;
        filesCountEl.textContent = selected + ' files';
      }
    }

    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', function () {
        cardCheckboxes.forEach((cb) => {
          (cb as HTMLInputElement).checked = selectAllCheckbox.checked;
        });
        updateFilesCount();
      });
    }

    cardCheckboxes.forEach((cb) => {
      cb.addEventListener('change', function () {
        if (!(cb as HTMLInputElement).checked && selectAllCheckbox && selectAllCheckbox.checked) {
          selectAllCheckbox.checked = false;
        }
        updateFilesCount();
      });
    });

    // Блокируем submit у поиска (чтобы страница не перезагружалась)
    const searchForm = document.querySelector('.edbpp-search');
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/CSS/main.css" />
        <link rel="stylesheet" href="/CSS/sing-in.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>EURODIB</title>
      </Head>      <>
        <section className="edbpp-wrapper">
          <div className="edbpp-container">
            {/* Header */}
            <div className="edbpp-header">
              <h1 className="edbpp-title">Product pictures</h1>
              <p className="edbpp-subtitle">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod elementum convallis.
                Quisque rutrum tortor at elit feugiat egestas.
              </p>
            </div>

            {/* Search & actions */}
            <div className="edbpp-topbar">
              <form className="edbpp-search">
                <input
                  type="text"
                  className="edbpp-search-input"
                  placeholder="Type in the SKU you are looking for"
                />
                <button type="submit" className="edbpp-search-btn">
                  <span className="edbpp-search-icon" aria-hidden="true">
                    {/* простая иконка лупы */}
                    <svg viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="6"></circle>
                      <line x1="16" y1="16" x2="21" y2="21"></line>
                    </svg>
                  </span>
                </button>
              </form>

              <div className="edbpp-topbar-actions">
                <label className="edbpp-select-all-label">
                  <input type="checkbox" className="edbpp-select-all-checkbox" />
                  <span>Select all</span>
                </label>

                <div className="edbpp-files-info">
                  <span className="edbpp-files-count">3 files</span>
                  <span className="edbpp-files-size">/ 5.3 MB</span>
                </div>

                <button className="edbpp-download-btn" type="button">
                  Download
                </button>
              </div>
            </div>

            <div className="edbpp-layout">
              {/* Filters */}
              <aside className="edbpp-filters">
                <div className="edbpp-filters-header">
                  <span className="edbpp-filters-title">Filters</span>
                  <button className="edbpp-filters-close" type="button" aria-label="Close filters"></button>
                </div>

                {/* Categories */}
                <div className="edbpp-filter-group edbpp-filter-group--open">
                  <button className="edbpp-filter-group-header" type="button">
                    <span>Categories</span>
                    <span className="edbpp-filter-group-toggle" aria-hidden="true"></span>
                  </button>
                  <div className="edbpp-filter-group-body">
                    <label className="edbpp-filter-item">
                      <span>Dishwashing</span><span className="edbpp-filter-count">(27)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Ice Machines</span><span className="edbpp-filter-count">(27)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Refrigeration</span><span className="edbpp-filter-count">(20)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Cooking and Baking</span><span className="edbpp-filter-count">(25)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Food Prep</span><span className="edbpp-filter-count">(120)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Dessert Equipment</span><span className="edbpp-filter-count">(211)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Vacuum Sealing</span><span className="edbpp-filter-count">(50)</span>
                    </label>
                  </div>
                </div>

                {/* Brands */}
                <div className="edbpp-filter-group edbpp-filter-group--open">
                  <button className="edbpp-filter-group-header" type="button">
                    <span>Brands</span>
                    <span className="edbpp-filter-group-toggle" aria-hidden="true"></span>
                  </button>
                  <div className="edbpp-filter-group-body">
                    <label className="edbpp-filter-item">
                      <span>Atmovac</span><span className="edbpp-filter-count">(18)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Brema</span><span className="edbpp-filter-count">(19)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Cofrimell</span><span className="edbpp-filter-count">(8)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Dito Sama</span><span className="edbpp-filter-count">(190)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Eurodib</span><span className="edbpp-filter-count">(87)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Gemm</span><span className="edbpp-filter-count">(14)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Krampouz</span><span className="edbpp-filter-count">(32)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Lamber</span><span className="edbpp-filter-count">(30)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Nemox</span><span className="edbpp-filter-count">(6)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Resolute</span><span className="edbpp-filter-count">(12)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Spidocook</span><span className="edbpp-filter-count">(7)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Unox</span><span className="edbpp-filter-count">(36)</span>
                    </label>
                    <label className="edbpp-filter-item">
                      <span>Visvardis</span><span className="edbpp-filter-count">(13)</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Products grid */}
              <main className="edbpp-grid">
                {/* карточка 1 */}
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>

                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>
                {/* карточка 2 */}
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">Ice Scoop</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">10016</div>
                  </div>
                </article>

                {/* карточка 3 */}
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">Ice Machine<br />cleaner</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">ICECLEAN01</div>
                  </div>
                </article>

                {/* карточка 4 */}
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>

                {/* продублируем несколько, чтобы было как на макете */}
                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">Ice Scoop</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">10016</div>
                  </div>
                </article>

                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">Ice Machine<br />cleaner</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">ICECLEAN01</div>
                  </div>
                </article>

                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">B-QUBE<br />Ice Machine</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">CB249A BHC AWS</div>
                  </div>
                </article>

                <article className="edbpp-card">
                  <label className="edbpp-card-checkbox">
                    <input type="checkbox" className="edbpp-card-input" />
                    <span className="edbpp-card-checkbox-box"></span>
                  </label>
                  <div className="edbpp-card-image">
                    <div className="edbpp-card-image-placeholder"></div>
                  </div>
                  <div className="edbpp-card-body">
                    <div className="edbpp-card-name">Ice Scoop</div>
                    <div className="edbpp-card-brand">BREMA</div>
                    <div className="edbpp-card-model">10016</div>
                  </div>
                </article>
              </main>
            </div>

            {/* Pagination */}
            <div className="edbpp-pagination">
              <button className="edbpp-page-btn edbpp-page-btn--active" type="button">1</button>
              <button className="edbpp-page-btn" type="button">2</button>
              <button className="edbpp-page-btn" type="button">&gt;</button>
            </div>
          </div>
        </section>
      </>
        {/* Email Signup Section */}
      <Script src="/JS/main.js" strategy="afterInteractive" />
    </>
  );
}

