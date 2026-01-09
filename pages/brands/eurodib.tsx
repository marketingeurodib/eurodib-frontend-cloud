import { useState } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { fetchEurodibProducts, type BrandProduct } from '../../lib/api/brands';

interface EurodibPageProps {
  products: BrandProduct[];
}

export const getServerSideProps: GetServerSideProps<EurodibPageProps> = async () => {
  try {
    const products = await fetchEurodibProducts();
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    console.error('Error fetching Eurodib products:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};

export default function Eurodib({ products }: EurodibPageProps) {
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
        <title>Eurodib | Professional Kitchen Equipment</title>
        <meta
          name="description"
          content="Discover Eurodib's professional kitchen equipment: cooking appliances, food preparation, refrigeration, ice machines and more — designed for foodservice professionals across North America."
        />
      </Head>

      <div className="page-atmovac">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Brands', href: '/brands' },
            { label: 'Eurodib' },
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
            src="/image/Banner-eurodib.png"
            alt="Eurodib brand banner"
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
              width: '321px',
              height: '98px',
            }}
          >
            <Image
              src="/image/Eurodib logo.png"
              alt="Eurodib logo"
              width={321}
              height={98}
              priority
            />
          </div>
        </section>

        {/* Brand description */}
        <div className="brema-description">
          <h2>Eurodib</h2>
          <p>
            Since 1996, Eurodib has been offering a wide range of commercial
            equipment carefully designed to meet the diverse and evolving needs
            of food service professionals across North America. With a strong
            focus on functionality and durability, the brand provides reliable,
            versatile, and accessible solutions suitable for a wide variety of
            professional environments, from small-scale kitchens to large-scale
            operations.
          </p>
          <p>
            The Eurodib product range includes cooking appliances, food
            preparation equipment, mixers, refrigeration units, ice machines,
            and many other essential items for a high-performance kitchen. These
            products stand out with their robust construction, ease of use, and
            practical, user-friendly design, which is designed to maximize space
            and efficiency on a daily basis. Their sleek, contemporary style,
            ease of maintenance, and consistent performance make them reliable
            tools for long-term use. By combining modern aesthetics with proven
            reliability, the brand offers equipment that professionals can
            confidently integrate into their daily operations. Over the years,
            Eurodib has solidified its position as a trusted and strategic
            partner for commercial kitchens.
          </p>
        </div>

        {/* Products + filters */}
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
                <img
                  src="/image/toggle-filter.png"
                  alt="toggle"
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <label>
                  Cooking equipment (27) <input type="checkbox" />
                </label>
                <label>
                  Refrigeration (18) <input type="checkbox" />
                </label>
                <label>
                  Food preparation (12) <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-header">
                <h4>Product type</h4>
                <img
                  src="/image/toggle-filter.png"
                  alt="toggle"
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <label>
                  Countertop <input type="checkbox" />
                </label>
                <label>
                  Floor model <input type="checkbox" />
                </label>
                <label>
                  Accessories <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-header">
                <h4>Price</h4>
                <img
                  src="/image/toggle-filter.png"
                  alt="toggle"
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <div className="price-range-container">
                  <span id="minPriceValue">$0</span>
                  <span id="maxPriceValue">$10,000</span>
                </div>
                <div className="slider-container">
                  <input
                    type="range"
                    id="minPrice"
                    min="0"
                    max="10000"
                    defaultValue="0"
                    step="100"
                  />
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
                <img
                  src="/image/toggle-filter.png"
                  alt="toggle"
                  className="toggle-arrow"
                />
              </div>
              <div className="filter-content">
                <label>
                  Yes <input type="checkbox" />
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

              <Link href="/brands/eurodib" className="brema-clear">
                Clear all
              </Link>

              {filtersOpen && (
                <div
                  className="filters-backdrop"
                  onClick={handleCloseFilters}
                  aria-hidden="true"
                />
              )}

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
              <Link href="#" className="current">
                1
              </Link>
              <Link href="#">2</Link>
              <Link href="#">
                <Image
                  src="/image/Rectangle-45.png"
                  alt="Next"
                  width={9}
                  height={9}
                  style={{
                    verticalAlign: 'middle',
                  }}
                />
              </Link>
            </div>
          </div>
        </section>
      </div>

    </>
  );
}

