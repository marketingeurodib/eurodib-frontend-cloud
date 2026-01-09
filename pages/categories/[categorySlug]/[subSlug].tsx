import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ArchiveTemplate } from '../../../components/catalog/ArchiveTemplate';
import Breadcrumbs from '../../../components/Breadcrumbs';
import type { Product } from '../../../data/products';
import {
  fetchProductsBySubcategorySlug,
  getSubcategoryDataBySlug,
  getCategoryDataBySlug,
  type CategoryData,
} from '../../../lib/api/categories';
import { prepareFilterConfig } from '../../../lib/utils/filterConfig';
import { getLocaleFromContext } from '../../../lib/utils/locale';

interface SubcategoryArchiveProps {
  notFound?: boolean;
  title: string;
  description?: string;
  products: Product[];
  bannerImage?: string;
  bannerAlt?: string;
  error?: boolean;
  categoryName?: string;
}

export default function SubcategoryArchivePage({
  notFound,
  title,
  description,
  products,
  bannerImage,
  bannerAlt,
  error,
  categoryName,
}: SubcategoryArchiveProps) {
  if (notFound) {
    return (
      <>
        <Head>
          <title>Subcategory Not Found | Eurodib</title>
        </Head>
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1>Subcategory not found</h1>
          <p>The subcategory you&apos;re looking for doesn&apos;t exist.</p>
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
          { label: 'Categories', href: '/categories' },
          ...(categoryName ? [{ label: categoryName, href: `/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}` }] : []),
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

export const getServerSideProps: GetServerSideProps<SubcategoryArchiveProps> = async (ctx) => {
  const categorySlug = String(ctx.params?.categorySlug || '').toLowerCase();
  const subSlug = String(ctx.params?.subSlug || '').toLowerCase();

  // Получаем локаль из контекста (cookie, query, header)
  const locale = getLocaleFromContext(ctx);

  try {
    // Получаем данные категории, подкатегории и продукты через API слой
    const [categoryData, subcategoryData, products] = await Promise.all([
      getCategoryDataBySlug(categorySlug, locale),
      getSubcategoryDataBySlug(categorySlug, subSlug, locale),
      fetchProductsBySubcategorySlug(categorySlug, subSlug, locale),
    ]);

    if (!subcategoryData || products.length === 0) {
      return {
        notFound: true,
        props: {
          title: subSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: '',
          products: [],
          categoryName: categoryData?.name,
        },
      };
    }

    return {
      props: {
        title: subcategoryData.name,
        description: subcategoryData.description,
        products,
        bannerImage: subcategoryData.bannerImage,
        bannerAlt: subcategoryData.bannerAlt,
        error: false,
        categoryName: categoryData?.name,
      },
    };
  } catch (error) {
    console.error('Error fetching subcategory data:', error);
    return {
      props: {
        title: subSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: '',
        products: [],
        error: true,
        categoryName: undefined,
      },
    };
  }
};

