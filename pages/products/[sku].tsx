// pages/products/[sku].tsx

import { useState, useEffect, useRef } from 'react';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Breadcrumbs from '../../components/Breadcrumbs';
import Link from 'next/link';
import type { Product } from '../../data/products';
import { products } from '../../data/products';
import { fetchProductBySku } from '../../lib/productsApi';

interface ProductPageProps {
  product: Product | null;
  sku: string;
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const { sku } = context.params!;

  if (!sku || Array.isArray(sku)) {
    return {
      notFound: true,
    };
  }

  const decodedSku = decodeURIComponent(sku);

  try {
    const product = await fetchProductBySku(decodedSku);
    return { props: { product, sku: decodedSku } };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { props: { product: null, sku: decodedSku } };
  }
};

export default function ProductPage({ product, sku }: ProductPageProps) {

  // Gallery images state
  const galleryImages = product
    ? [
        product.image, // главное изображение из data/products
        'http://eurodib.com/wp-content/uploads/2024/01/CB249A_back.jpg',
        'http://eurodib.com/wp-content/uploads/2024/01/CB249A_front.jpg',
        'http://eurodib.com/wp-content/uploads/2024/01/CB425A-04.jpg.png',
        'http://eurodib.com/wp-content/uploads/2024/01/IceCube.jpg',
      ]
    : [];

  const [activeImage, setActiveImage] = useState(galleryImages[0] || '');
  const [openSection, setOpenSection] = useState<'features' | 'specs' | null>('features');

  // Reorder info-section on mobile (from single-products.js logic)
  const topContainerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;

    const BREAKPOINT = 768;
    const topContainer = topContainerRef.current;
    const leftColumn = leftColumnRef.current;
    const rightColumn = rightColumnRef.current;
    const infoSection = infoSectionRef.current;

    if (!topContainer || !leftColumn || !rightColumn || !infoSection) return;

    const originalNext = infoSection.nextSibling;
    const originalParent = leftColumn;

    function reorder() {
      if (!infoSection || !topContainer || !rightColumn || !originalParent) return;
      
      if (window.innerWidth <= BREAKPOINT) {
        if (infoSection.parentNode !== topContainer) {
          topContainer.insertBefore(infoSection, rightColumn.nextSibling);
        }
      } else {
        if (infoSection.parentNode !== originalParent) {
          if (originalNext && originalNext.parentNode === originalParent) {
            originalParent.insertBefore(infoSection, originalNext);
          } else {
            originalParent.appendChild(infoSection);
          }
        }
      }
    }

    reorder();
    window.addEventListener('resize', reorder);

    return () => {
      window.removeEventListener('resize', reorder);
    };
  }, [product]);

  // Update activeImage when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const toggleSection = (section: 'features' | 'specs') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  if (!product) {
    return (
      <>
        <Head>
          <title>Product not found | Eurodib</title>
          <meta name="description" content="The product you are looking for could not be found." />
        </Head>
        <div className="container" style={{ padding: '40px 0' }}>
          <h1>Product not found</h1>
          <p>We couldn&apos;t find this product. Please check the link or browse the catalog.</p>
          <p>SKU: {sku}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        <title>{product.name} | {product.brand} | Eurodib</title>
        <meta
          name="description"
          content={product.shortDescription || `${product.name} by ${product.brand}. SKU: ${product.sku}. Price: $${product.price.toLocaleString()}`}
        />
        <link rel="stylesheet" href="/CSS/single-products.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <>
        {/* Основной продуктовый блок */}
        <section className="product-page">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Ice Machines', href: '/archive-page' },
              { label: 'Ice makers', href: '/archive-page' },
              { label: product.name },
            ]}
          />

          <div className="top-container" ref={topContainerRef}>
            {/* Левая колонка */}
            <div className="left-column" ref={leftColumnRef}>
              {/* Изображения */}
              <div className="image-wrapper">
                <div className="image-container">
                  <img
                    className="main-image"
                    src={activeImage}
                    alt={`${product.name} ${product.brand}`}
                  />
                </div>
                <button className="zoom-btn" aria-label="Zoom">
                  <img src="/image/Magnify-glassblack.png" alt="" />
                </button>
              </div>
              <div className="thumbnails">
                {galleryImages.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    className={`thumb ${img === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>

              {/* Nema/Certifications + Documents */}
              <div className="info-section" ref={infoSectionRef}>
                <div className="info-row">
                  <div className="info-block">
                    <h4>Nema</h4>
                    <img src="https://eurodib.com/wp-content/uploads/2021/02/5-15P.jpg" alt="5-15P" />
                  </div>
                  <div className="info-block">
                    <h4>Certifications</h4>
                    <div className="cert-icons">
                      <img src="https://eurodib.com/wp-content/uploads/2021/06/c_ul_us.png" alt="cULus" />
                      <img src="https://eurodib.com/wp-content/uploads/2021/07/UL_Energy_leaf.jpg" alt="UL Leaf" />
                      <img src="https://eurodib.com/wp-content/uploads/2021/07/NSF_black.jpg" alt="NSF" />
                    </div>
                  </div>
                </div>
                <div className="documents">
                  <h4>Documents</h4>
                  <ul>
                    <li>
                      <img src="/image/Layer_1.png" alt="PDF" />
                      {product.sku} – Spec sheet
                    </li>
                    <li>
                      <img src="/image/Layer_1.png" alt="PDF" />
                      {product.name} – Complete Lineup
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className="right-column" ref={rightColumnRef}>
              <div className="brand-logo">
                <img src="/image/logos/Euro_web_logo_Brema.svg" alt={product.brand} />
              </div>
              <h1 className="product-title">{product.name}</h1>
              <div className="brand-text">{product.brand.toUpperCase()}</div>
              <div className="model">{product.sku}</div>
              <div className="price">
                ${product.price.toLocaleString()}
              </div>

              {product.shortDescription ? (
                <p className="intro">{product.shortDescription}</p>
              ) : (
                <p className="intro">
                  B-Qube machines by BREMA are designed for bars, restaurants, hotels and clubs.
                  Perfect for mixing drinks, these cubes do not break when shaken and do not melt like traditional cubes.
                </p>
              )}

              <div className="buttons">
                <button className="btn primary">Add to cart</button>
                <Link href="/cart-v2">
                  <button className="btn secondary">Request a quote</button>
                </Link>
              </div>

              {/* Аккордеон Features / Specifications */}
              <div className="accordion">
                <div
                  className={`accordion-header ${openSection === 'features' ? 'active' : ''}`}
                  onClick={() => toggleSection('features')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSection('features');
                    }
                  }}
                >
                  Features
                  <img src="/image/Rectangle-29.png" alt="toggle" className="toggle-arrow" />
                </div>
                <div className={`accordion-body ${openSection === 'features' ? 'open' : ''}`}>
                  <p>
                    B-Qube machines by BREMA are designed for bars, restaurants, hotels and clubs.
                    Perfect for mixing drinks, these cubes do not break when shaken and do not melt like traditional cubes.
                  </p>
                  <ul className="features">
                    <li>Compact, crystal ice</li>
                    <li>Adjustable Stainless Steel feet (3/16&quot;)</li>
                    <li>Air cooling system</li>
                    <li>Easy cleanable internal rounded surfaces</li>
                    <li>HCFC-Free insulated storage</li>
                    <li>RoHS Free</li>
                    <li>Retractable insulated door</li>
                    <li>Electromechanical operation</li>
                    <li>ON-OFF switch</li>
                    <li>HFC Free</li>
                    <li>HC R290 Refrigerant Gas</li>
                  </ul>
                  <p className="wash-note">
                    AWS (Automatic Washing System): In 1.5 hours your machine will complete its self-cleaning cycle, after which your machine will be completely cleaned and descaled.
                    See <a href="#">Ice Machine Cleaner</a>.
                  </p>
                </div>

                <div
                  className={`accordion-header ${openSection === 'specs' ? 'active' : ''}`}
                  onClick={() => toggleSection('specs')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSection('specs');
                    }
                  }}
                >
                  Specifications
                  <img src="/image/Rectangle-29.png" alt="toggle" className="toggle-arrow" />
                </div>
                <div className={`accordion-body ${openSection === 'specs' ? 'open' : ''}`}>
                  <div className="spec-table">
                    <div className="spec-row"><span>Watts:</span><span>320W</span></div>
                    <div className="spec-row"><span>Amperage:</span><span>3A</span></div>
                    <div className="spec-row"><span>Material:</span><span>AISI 304 Stainless Steel, Scotch Brite finish</span></div>
                    <div className="spec-row"><span>Nema:</span><span>5-15P</span></div>
                    <div className="spec-row"><span>Volts:</span><span>115V</span></div>
                  </div>
                  <ul className="extras">
                    <li>Production: 65 lbs/24 hrs</li>
                    <li>Bin capacity: 20 lbs</li>
                    <li>Cube size: 23g (1.28&quot; L × 1.24&quot; H)</li>
                    <li>SKU: {product.sku}</li>
                    <li>Origin: Italy</li>
                    <li>Warranty: 3 Years Parts &amp; Labor • 5 Years Compressor</li>
                    <li>Height: 27.2&quot;</li>
                    <li>Length: 18.1&quot;</li>
                    <li>Width: 15.4&quot;</li>
                    <li>Weight: 82 lbs</li>
                    <li>Package Length: 20.5&quot;</li>
                    <li>Package Height: 34.6&quot;</li>
                    <li>Package Weight: 97 lbs</li>
                  </ul>
                  <p className="note">
                    Ships by transport (less-than-truckload). <br /> <strong>*REQUIRES A PALLET.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Секция You may also like */}
        <section className="recommendations">
          <h2 className="section-title">You may also like</h2>
          <div className="card-grid">
            {products
              .filter((p) => p.sku !== product.sku)
              .slice(0, 5)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.sku}
                  href={`/products/${encodeURIComponent(relatedProduct.sku)}`}
                  className="card"
                >
                  <img src={relatedProduct.image} alt={`${relatedProduct.name} ${relatedProduct.brand}`} />
                  <h3>{relatedProduct.name}</h3>
                  <p className="brand_may_also_like">{relatedProduct.brand}</p>
                  <p className="description_may_also_like">{relatedProduct.sku}</p>
                  <span>${relatedProduct.price.toLocaleString()}</span>
                </Link>
              ))}
          </div>
        </section>

        {/* Секция Related products */}
        <section className="related-products">
          <h2 className="section-title">Related products</h2>
          <div className="card-grid related">
            {products
              .filter((p) => p.brand === product.brand && p.sku !== product.sku)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.sku}
                  href={`/products/${encodeURIComponent(relatedProduct.sku)}`}
                  className="card"
                >
                  <img src={relatedProduct.image} alt={`${relatedProduct.name} ${relatedProduct.brand}`} />
                  <h3>{relatedProduct.name}</h3>
                  <p className="brand_may_also_like">{relatedProduct.brand}</p>
                  <p className="description_may_also_like">{relatedProduct.sku}</p>
                  <span>${relatedProduct.price.toLocaleString()}</span>
                </Link>
              ))}
          </div>
        </section>

        {/* Email Signup Section */}
      </>
    </>
  );
}

