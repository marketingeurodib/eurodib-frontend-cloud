import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '../../components/Breadcrumbs';
import { fetchAtmovacProducts, type BrandProduct } from '../../lib/api/brands';

interface AtmovacPageProps {
  products: BrandProduct[];
}

export const getServerSideProps: GetServerSideProps<AtmovacPageProps> = async () => {
  try {
    const products = await fetchAtmovacProducts();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching Atmovac products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};

export default function Atmovac({ products }: AtmovacPageProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleToggleFilters = () => {
    setFiltersOpen((prev) => !prev);
  };

  const handleCloseFilters = () => {
    setFiltersOpen(false);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/atmovac.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
        <title>ATMOVAC | Vacuum & Sous-Vide Solutions | Eurodib</title>
        <meta
          name="description"
          content="Discover ATMOVAC by Eurodib: professional vacuum packaging and sous-vide solutions for commercial kitchens. Explore popular series, key benefits and products."
        />
      </Head>

      <div className="page-atmovac">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Brands', href: '/brands' },
            { label: 'ATMOVAC' },
          ]}
        />

        {/* Hero banner */}
        <section
          className="brema-banner"
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/image/Banner-atmovac.png"
            alt="ATMOVAC vacuum & sous-vide equipment banner"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '120px',
              transform: 'translateY(-50%)',
              width: '382px',
              height: '65px',
              positionAnchor: 'center', // игнорируется старыми браузерами, но не мешает
            } as React.CSSProperties}
          >
            <Image
              src="/image/Atmovac logo black.png"
              alt="ATMOVAC Logo"
              fill
              sizes="382px"
              style={{ objectFit: 'contain' }}
            />
          </div>
          </section>

        {/* Brand description */}
          <div className="brema-description">
          <h1>ATMOVAC</h1>
            <p>
            Launched in 20XX, Atmovac specializes in commercial sous-vide solutions tailored to
            foodservice and culinary professionals. Its innovation in vacuum sealing and sous-vide
            cooking technology makes it a reliable choice for chefs and restaurateurs across Canada
            and the United States. The reliability of its technology, combined with a deep
            understanding of the professional kitchen environment, allows it to meet the high
            demands of the food industry. From small kitchens to large establishments, Atmovac
            offers solutions tailored to professional kitchen needs.
            </p>
            <p>
            The brand offers a complete range of machines and accessories designed to simplify
            kitchen operations and raise quality standards. Every piece of equipment is designed to
            meet the performance, reliability, and durability requirements of the food industry.
            Whether it&apos;s to extend food freshness, streamline food preparation, or elevate
            service quality, Atmovac makes sous-vide innovation accessible. Using sous-vide culinary
            techniques efficiently has never been easier for professionals at all levels.
            </p>
          </div>

        {/* Popular Series */}
          <section className="category-section">
            <div className="category-section__container">
              <h2 className="category-section__title">Popular Series</h2>
              <div className="category-section__grid">
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Arctic-bubble.png')" }}
              >
                  <span className="category-card__label">ARCTIC</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Chinook\\ bubble.png')" }}
              >
                  <span className="category-card__label">CHINOOK</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Diablo\\ bubble.png')" }}
              >
                  <span className="category-card__label">DIABLO</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Kaze\\ bubble.png')" }}
              >
                  <span className="category-card__label">KAZE</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Pampero\\ bubble.png')" }}
              >
                  <span className="category-card__label">PAMPERO</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Solar\\ bubble.png')" }}
              >
                  <span className="category-card__label">SOLAR</span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Sous-vide\\ cooking\\ bubble.png')" }}
              >
                <span className="category-card__label">
                  SOUS-VIDE
                  <br />
                  COOKING
                </span>
                </div>
              <div
                className="category-card"
                style={{ backgroundImage: "url('/image/Vacuum\\ bags\\ bubble.png')" }}
              >
                <span className="category-card__label">
                  VACUUM
                  <br />
                  BAGS
                </span>
                </div>
              </div>
            </div>
          </section>

        {/* 5 Returns on your investment */}
          <section className="returns-section">
            <h2>5 Returns on your investment</h2>
            <div className="returns-items">
              <div className="returns-item">
              <h3>
                Scale
                <br />
                Saving
              </h3>
                <p>Own your packaging, portion to your needs, and save money on bulk purchases.</p>
              </div>
            <div className="divider" />
              <div className="returns-item">
              <h3>
                Food
                <br />
                Saving
              </h3>
              <p>
                Extend the shelf life of your foodstuff and increase the opportunity for a return on
                it.
              </p>
              </div>
            <div className="divider" />
              <div className="returns-item">
              <h3>
                Workflow
                <br />
                Optimisation
              </h3>
                <p>Deliver a quality product day in and day out with fewer hands on deck.</p>
              </div>
            <div className="divider" />
              <div className="returns-item">
              <h3>
                Go to
                <br />
                Market
              </h3>
                <p>Expand your opportunities by reaching out to the market in new ways.</p>
              </div>
            <div className="divider" />
              <div className="returns-item">
              <h3>
                Sous-
                <br />
                vide
              </h3>
              <p>
                Integrate the principles of Sous-Vide cooking to get the most out of your
                ingredients.
              </p>
              </div>
            </div>
          </section>

        {/* Products block (пока статический по дизайну, без динамических фильтров) */}
          <section className="brema-products-container">
            {/* Filters */}
          <aside
            id="brema-filters"
            className={`brema-filters ${filtersOpen ? 'is-open' : ''}`}
          >
            <h3>
              Filters{' '}
              <button
                className="close-btn"
                type="button"
                onClick={handleCloseFilters}
                aria-label="Close filters"
              >
                ✕
              </button>
            </h3>

              <div className="filter-group">
                <div className="filter-header">
                  <h4>Categories</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle categories"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
                </div>
                <div className="filter-content">
                <label>
                  Chamber vacuum machines (8) <input type="checkbox" />
                </label>
                <label>
                  External vacuum machines (4) <input type="checkbox" />
                </label>
                <label>
                  Vacuum bags & accessories (4) <input type="checkbox" />
                </label>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                <h4>Application</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle application"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
                </div>
                <div className="filter-content">
                <label>
                  Sous-vide cooking <input type="checkbox" />
                </label>
                <label>
                  Storage & preservation <input type="checkbox" />
                </label>
                <label>
                  Portioning & prep <input type="checkbox" />
                </label>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                <h4>Chamber size</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle chamber size"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
                </div>
                <div className="filter-content">
                <label>
                  Small footprint <input type="checkbox" />
                </label>
                <label>
                  Medium <input type="checkbox" />
                </label>
                <label>
                  Large / double chamber <input type="checkbox" />
                </label>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <h4>Price</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle price filter"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
                </div>
                <div className="filter-content">
                  <div className="price-range-container">
                    <span id="minPriceValue">$0</span>
                  <span id="maxPriceValue">$10,000</span>
                  </div>
                  <div className="slider-container">
                  <input type="range" id="minPrice" min="0" max="10000" defaultValue="0" step="100" />
                  <input
                    type="range"
                    id="maxPrice"
                    min="0"
                    max="10000"
                    defaultValue="10000"
                    step="100"
                  />
                  </div>
                  <p>{products.length} products</p>
                <button type="button">Apply</button>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-header">
                  <h4>In stock</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle in stock filter"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
                </div>
                <div className="filter-content">
                <label>
                  Yes (23) <input type="checkbox" />
                </label>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="brema-product-list">
              <div className="products-header">
                <h3>Products</h3>

              <button
                className="filters-toggle"
                type="button"
                aria-controls="brema-filters"
                aria-expanded={filtersOpen}
                onClick={handleToggleFilters}
              >
                  Filters
                </button>

              <button
                type="button"
                className="brema-clear"
                onClick={() => {
                  /* здесь позже можно будет повесить reset фильтров */
                }}
              >
                Clear all
              </button>

              <div
                className={`filters-backdrop ${filtersOpen ? 'is-open' : ''}`}
                onClick={handleCloseFilters}
              />

                <div className="sort-box">
                  <span>{products.length} products</span>
                <button type="button">Sort by</button>
              </div>
            </div>

              <div className="brema-product-grid">
              {products.map((product) => (
                <div className="brema-product-card" key={product.id}>
                  <div className="brema-product-card__image">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h4>{product.name}</h4>
                  <h4>{product.brand}</h4>
                  <p>{product.sku}</p>
                  <p className="price">
                    {product.price.toLocaleString('en-CA', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
              <div className="pagination">
              <span className="current">1</span>
              <button type="button">2</button>
              <button type="button" aria-label="Next page">
                <Image
                  src="/image/Rectangle-45.png"
                  alt="Next"
                  width={9}
                  height={12}
                  style={{ verticalAlign: 'middle' }}
                />
              </button>
              </div>
            </div>
          </section>

      </div>
    </>
  );
}
