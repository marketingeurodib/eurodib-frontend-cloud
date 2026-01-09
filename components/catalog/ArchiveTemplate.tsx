import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/data/products';

export interface FilterConfig {
  categories?: Array<{ label: string; count: number; value: string }>;
  iceTypes?: Array<{ label: string; count: number; value: string }>;
  yield?: Array<{ label: string; count: number; value: string }>;
  priceRange?: { min: number; max: number };
  showInStock?: boolean;
}

export interface ArchiveTemplateProps {
  title: string;
  description?: string;
  products: Product[];
  filterConfig?: FilterConfig;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  bannerImage?: string;
  bannerAlt?: string;
  error?: boolean;
  className?: string;
}

export function ArchiveTemplate({
  title,
  description,
  products,
  filterConfig,
  breadcrumbs,
  bannerImage,
  bannerAlt,
  error = false,
  className = '',
}: ArchiveTemplateProps) {
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIceTypes, setSelectedIceTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filterConfig?.priceRange ? [filterConfig.priceRange.min, filterConfig.priceRange.max] : [0, 1700]
  );
  const [inStockOnly, setInStockOnly] = useState(false);

  // Аккордеоны фильтров
  const [openGroups, setOpenGroups] = useState({
    categories: true,
    iceTypes: true,
    yield: false,
    price: true,
    inStock: true,
  });

  const toggleGroup = (key: keyof typeof openGroups) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // In stock filter
      if (inStockOnly && product.inStock !== true) {
        return false;
      }

      // Categories filter
      if (
        selectedCategories.length > 0 &&
        product.category &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }

      // Ice types filter
      if (
        selectedIceTypes.length > 0 &&
        product.iceType &&
        !selectedIceTypes.includes(product.iceType)
      ) {
        return false;
      }

      return true;
    });
  }, [selectedCategories, selectedIceTypes, priceRange, inStockOnly, products]);

  // Handlers for filter changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleIceTypeChange = (iceType: string, checked: boolean) => {
    if (checked) {
      setSelectedIceTypes((prev) => [...prev, iceType]);
    } else {
      setSelectedIceTypes((prev) => prev.filter((t) => t !== iceType));
    }
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      setPriceRange((prev) => [Math.min(value, prev[1]), prev[1]]);
    } else {
      setPriceRange((prev) => [prev[0], Math.max(value, prev[0])]);
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedIceTypes([]);
    setPriceRange(
      filterConfig?.priceRange ? [filterConfig.priceRange.min, filterConfig.priceRange.max] : [0, 1700]
    );
    setInStockOnly(false);
  };

  return (
    <div className={className}>
      {/* Banner */}
      {bannerImage && (
        <section
          className="brema-banner"
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <Image
            src={bannerImage}
            alt={bannerAlt || `${title} banner`}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        </section>
      )}

      {/* Description */}
      {description && (
        <div className="brema-description">
          <h1>{title}</h1>
          <p dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      {/* Products + Filters */}
      <section className="brema-products-container">
        {/* Filters */}
        <aside className="brema-filters">
          <h3>
            Filters <button className="close-btn" type="button">✕</button>
          </h3>

          {/* Categories */}
          {filterConfig?.categories && filterConfig.categories.length > 0 && (
            <div className="filter-group">
              <button
                type="button"
                className="filter-header"
                onClick={() => toggleGroup('categories')}
                aria-expanded={openGroups.categories}
              >
                <h4>Categories</h4>
                <Image
                  src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-29.png"
                  alt="Toggle categories"
                  width={16}
                  height={16}
                  className={`toggle-arrow ${openGroups.categories ? 'is-open' : ''}`}
                />
              </button>
              {openGroups.categories && (
                <div className="filter-content">
                  {filterConfig.categories.map((cat) => (
                    <label key={cat.value}>
                      {cat.label} ({cat.count}){' '}
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.value)}
                        onChange={(e) => handleCategoryChange(cat.value, e.target.checked)}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ice types */}
          {filterConfig?.iceTypes && filterConfig.iceTypes.length > 0 && (
            <div className="filter-group">
              <button
                type="button"
                className="filter-header"
                onClick={() => toggleGroup('iceTypes')}
                aria-expanded={openGroups.iceTypes}
              >
                <h4>Ice types</h4>
                <Image
                  src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-29.png"
                  alt="Toggle ice types"
                  width={16}
                  height={16}
                  className={`toggle-arrow ${openGroups.iceTypes ? 'is-open' : ''}`}
                />
              </button>
              {openGroups.iceTypes && (
                <div className="filter-content">
                  {filterConfig.iceTypes.map((ice) => (
                    <label key={ice.value}>
                      {ice.label} ({ice.count}){' '}
                      <input
                        type="checkbox"
                        checked={selectedIceTypes.includes(ice.value)}
                        onChange={(e) => handleIceTypeChange(ice.value, e.target.checked)}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 24-hour yield */}
          {filterConfig?.yield && filterConfig.yield.length > 0 && (
            <div className="filter-group">
              <button
                type="button"
                className="filter-header"
                onClick={() => toggleGroup('yield')}
                aria-expanded={openGroups.yield}
              >
                <h4>24-hour ice yield</h4>
                <Image
                  src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-29.png"
                  alt="Toggle 24-hour ice yield"
                  width={16}
                  height={16}
                  className={`toggle-arrow ${openGroups.yield ? 'is-open' : ''}`}
                />
              </button>
              {openGroups.yield && (
                <div className="filter-content">
                  {filterConfig.yield.map((y) => (
                    <label key={y.value}>
                      {y.label} ({y.count}) <input type="checkbox" />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price */}
          {filterConfig?.priceRange && (
            <div className="filter-group">
              <button
                type="button"
                className="filter-header"
                onClick={() => toggleGroup('price')}
                aria-expanded={openGroups.price}
              >
                <h4>Price</h4>
                <Image
                  src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-29.png"
                  alt="Toggle price filter"
                  width={16}
                  height={16}
                  className={`toggle-arrow ${openGroups.price ? 'is-open' : ''}`}
                />
              </button>
              {openGroups.price && (
                <div className="filter-content">
                  <div className="price-range-container">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min={filterConfig.priceRange.min}
                      max={filterConfig.priceRange.max}
                      value={priceRange[0]}
                      step="10"
                      onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min={filterConfig.priceRange.min}
                      max={filterConfig.priceRange.max}
                      value={priceRange[1]}
                      step="10"
                      onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                    />
                  </div>
                  <p>{filteredProducts.length} products</p>
                  <button type="button" onClick={resetFilters}>
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* In stock */}
          {filterConfig?.showInStock && (
            <div className="filter-group">
              <button
                type="button"
                className="filter-header"
                onClick={() => toggleGroup('inStock')}
                aria-expanded={openGroups.inStock}
              >
                <h4>In stock</h4>
                <Image
                  src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-29.png"
                  alt="Toggle in-stock filter"
                  width={16}
                  height={16}
                  className={`toggle-arrow ${openGroups.inStock ? 'is-open' : ''}`}
                />
              </button>
              {openGroups.inStock && (
                <div className="filter-content">
                  <label>
                    Yes ({products.filter((p) => p.inStock).length}){' '}
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Products */}
        <div className="brema-product-list">
          <div className="products-header">
            <h3>Products</h3>
            {!error && products.length > 0 && (
              <div className="sort-box">
                <span>{filteredProducts.length} products</span>
                <button type="button">Sort by</button>
              </div>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: '#dc2626',
                  }}
                >
                  Error loading products
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                  }}
                >
                  We encountered an error while loading the products. Please try again later or contact us
                  if the problem persists.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      backgroundColor: '#286AB8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Try again
                  </button>
                  <Link
                    href="/contact-us"
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      backgroundColor: 'transparent',
                      color: '#286AB8',
                      textDecoration: 'none',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '16px',
                      border: '2px solid #286AB8',
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!error && products.length === 0 && (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: '#1f2937',
                  }}
                >
                  No products found
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                  }}
                >
                  We couldn&apos;t find any products at the moment. Please check back later or browse other
                  categories.
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    padding: '14px 32px',
                    backgroundColor: '#286AB8',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Go to homepage
                </Link>
              </div>
            </div>
          )}

          {/* Empty filtered state */}
          {!error && products.length > 0 && filteredProducts.length === 0 && (
            <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: '#1f2937',
                  }}
                >
                  No products match your filters
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                  }}
                >
                  Try adjusting your filters or clearing them to see more products.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    display: 'inline-block',
                    padding: '14px 32px',
                    backgroundColor: '#286AB8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* Products grid */}
          {!error && filteredProducts.length > 0 && (
            <>
              <div className="brema-product-grid">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.sku}
                    href={`/products/${encodeURIComponent(product.sku)}`}
                    className="brema-product-card"
                  >
                    <div className="brema-product-card__image">
                      <Image
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h4>{product.name}</h4>
                    <h4>{product.brand}</h4>
                    <p>{product.sku}</p>
                    <p className="price">${product.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>

              {/* Pagination – пока статический заглушка */}
              <div className="pagination">
                <span className="current">1</span>
                <button type="button" disabled>
                  2
                </button>
                <button type="button" disabled aria-label="Next page">
                  <Image
                    src="https://eurodib.com/wp-content/uploads/2024/01/Rectangle-45.png"
                    alt="Next"
                    width={9}
                    height={12}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
