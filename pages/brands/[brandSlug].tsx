import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ArchiveTemplate } from '../../components/catalog/ArchiveTemplate';
import Breadcrumbs from '../../components/Breadcrumbs';
import type { Product } from '../../data/products';
import {
  fetchProductsByBrandSlug,
  getBrandDataBySlug,
  type BrandData,
} from '../../lib/api/brands';
import { prepareFilterConfig } from '../../lib/utils/filterConfig';
import { getLocaleFromContext } from '../../lib/utils/locale';

const SPECIAL_BRANDS = ['atmovac', 'resolute', 'eurodib'];

interface BrandArchiveProps {
  notFound?: boolean;
  title: string;
  description?: string;
  products: Product[];
  bannerImage?: string;
  bannerAlt?: string;
  error?: boolean;
}

export default function BrandArchivePage({
  notFound,
  title,
  description,
  products,
  bannerImage,
  bannerAlt,
  error,
}: BrandArchiveProps) {
  if (notFound) {
    return (
      <>
        <Head>
          <title>Brand Not Found | Eurodib</title>
        </Head>
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1>Brand not found</h1>
          <p>The brand you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </>
    );
  }

  // Подготовка конфига фильтров через утилиту
  const filterConfig = prepareFilterConfig(products);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} | Eurodib</title>
        <meta
          name="description"
          content={description || `Browse ${title} products at Eurodib`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/CSS/archive-products.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/brands' },
          { label: title },
        ]}
      />

      <ArchiveTemplate
        title={title}
        description={description}
        products={products}
        filterConfig={filterConfig}
        bannerImage={bannerImage}
        bannerAlt={bannerAlt}
        error={error}
      />

    </>
  );
}

export const getServerSideProps: GetServerSideProps<BrandArchiveProps> = async (ctx) => {
  const slug = String(ctx.params?.brandSlug || '').toLowerCase();

  // Если "особый" бренд — редирект на кастомную страницу
  if (SPECIAL_BRANDS.includes(slug)) {
    return {
      redirect: {
        destination: `/brands/${slug}`,
        permanent: false,
      },
    };
  }

  // Получаем локаль из контекста (cookie, query, header)
  const locale = getLocaleFromContext(ctx);

  try {
    // Получаем данные бренда и продукты через API слой
    const [brandData, products] = await Promise.all([
      getBrandDataBySlug(slug, locale),
      fetchProductsByBrandSlug(slug, locale),
    ]);

    if (!brandData || products.length === 0) {
      return {
        notFound: true,
        props: {
          title: slug.toUpperCase(),
          description: '',
          products: [],
        },
      };
    }

    return {
      props: {
        title: brandData.name,
        description: brandData.description,
        products,
        bannerImage: brandData.bannerImage,
        bannerAlt: brandData.bannerAlt,
        error: false,
      },
    };
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return {
      props: {
        title: slug.toUpperCase(),
        description: '',
        products: [],
        error: true,
      },
    };
  }
};
