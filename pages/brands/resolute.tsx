import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { fetchResoluteProducts, type BrandProduct } from '../../lib/api/brands';

interface ResolutePageProps {
  products: BrandProduct[];
}

export const getServerSideProps: GetServerSideProps<ResolutePageProps> = async () => {
  try {
    const products = await fetchResoluteProducts();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching Resolute products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};

export default function Resolute({ products }: ResolutePageProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const totalProducts = products.length;

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
        <title>Resolute | Water &amp; Ice Dispensing Solutions | Eurodib</title>
        <meta
          name="description"
          content="Discover Resolute by Eurodib: water and ice dispensing equipment for demanding professional environments. Explore brand story and products."
        />
      </Head>

      <div className="page-resolute">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Brands', href: '/brands' },
            { label: 'Resolute' },
          ]}
        />

        {/* Hero banner */}
        <section
          className="brema-banner"
          style={
            {
              position: 'relative',
              width: '100%',
              height: '500px',
              margin: '0 auto',
              overflow: 'hidden',
            } as CSSProperties
          }
        >
          <Image
            src="/image/Resolut-banner.png"
            alt="Resolute equipment banner"
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
          <div
            style={
              {
                position: 'absolute',
                top: '50%',
                left: '120px',
                transform: 'translateY(-50%)',
                width: '500px',
                height: '114px',
              } as CSSProperties
            }
          >
            <Image
              src="/image/Resolute-logo.png"
              alt="Resolute logo"
              width={500}
              height={114}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </section>

        {/* Brand description */}
        <div className="brema-description">
          <h1>Resolute</h1>
          <p>
            Resolute is a Eurodib brand that specializes in water and ice dispensing equipment for
            demanding professional environments since 20XX. Designed to meet the rigorous needs of
            professional kitchens, hotels, and institutional establishments such as hospitals,
            Resolute offers efficient, robust, and easy-to-use equipment. Each product is a
            testament to the brand&apos;s unwavering commitment to quality and excellence.
          </p>
          <p>
            The brand meets the needs of professionals by offering reliable solutions with
            high-performance water dispensers and ice machines, without compromise. Guided by a firm
            commitment to the highest performance standards, the brand focuses on efficiency,
            durability, and ease of maintenance. All the products fit perfectly into various
            workspaces thanks to their well-designed and high-quality construction. Made to deliver
            consistent performance, they are reliable allies in everyday use.
          </p>
          <p>
            Supported by Eurodib&apos;s expertise, Resolute benefits from a well-established and
            efficient distribution network across North America, as well as attentive customer
            support and dedicated service, providing an unparalleled experience for all kitchen and
            service professionals.
          </p>
        </div>

        {/* Products block (как у Atmovac, но под Resolute) */}
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
                  Water &amp; Ice Dispensers (27) <input type="checkbox" />
                </label>
                <label>
                  Ice Makers (27) <input type="checkbox" />
                </label>
                <label>
                  Accessories (2) <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-header">
                <h4>Ice types</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle ice types"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <label>
                  B-cubes (4) <input type="checkbox" />
                </label>
                <label>
                  Cubes (16) <input type="checkbox" />
                </label>
                <label>
                  Flakes (4) <input type="checkbox" />
                </label>
                <label>
                  Pebbles (2) <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-header">
                <h4>24-hour ice yield</h4>
                <Image
                  src="/image/toggle-filter.png"
                  alt="Toggle ice yield"
                  width={16}
                  height={16}
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <label>
                  75-175 lbs (22) <input type="checkbox" />
                </label>
                <label>
                  176-300 lbs (3) <input type="checkbox" />
                </label>
                <label>
                  301-500 lbs (2) <input type="checkbox" />
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
                  <span id="maxPriceValue">$1,700</span>
                </div>
                <div className="slider-container">
                  <input
                    type="range"
                    id="minPrice"
                    min="0"
                    max="1700"
                    defaultValue="0"
                    step="10"
                  />
                  <input
                    type="range"
                    id="maxPrice"
                    min="0"
                    max="1700"
                    defaultValue="1700"
                    step="10"
                  />
                </div>
                <p>{totalProducts} products</p>
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
                  // здесь позже можно будет сбрасывать фильтры
                }}
              >
                Clear all
              </button>

              <div
                className={`filters-backdrop ${filtersOpen ? 'is-open' : ''}`}
                onClick={handleCloseFilters}
              />

              <div className="sort-box">
                <span>{totalProducts} products</span>
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
