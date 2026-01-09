import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ArchiveTemplate } from '../../components/catalog/ArchiveTemplate';
import type { Product } from '../../data/products';
import { prepareFilterConfig } from '../../lib/utils/filterConfig';
import { getLocaleFromContext } from '../../lib/utils/locale';

import {
  getCategoryDataBySlug,
  fetchProductsByCategorySlug,
  type CategoryData,
} from '../../lib/api/categories';

interface Props {
  category?: CategoryData;
  products: Product[];
  error?: boolean;
  title?: string;
  description?: string | null;
  bannerImage?: string | null;
  bannerAlt?: string | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const raw = String(ctx.params?.categorySlug || '');
  const slug = raw.trim().toLowerCase();

  // 1) Канонизация URL: /Dishwashing -> /dishwashing
  if (raw !== slug) {
    return {
      redirect: {
        destination: `/categories/${slug}`,
        permanent: true,
      },
    };
  }

  const rawLocale = getLocaleFromContext(ctx);
  // маппинг Next -> Strapi i18n
  const locale =
    rawLocale === 'en' || rawLocale === 'en-US' ? 'en-CA' :
    rawLocale === 'fr' || rawLocale === 'fr-CA' ? 'fr-CA' :
    (rawLocale || 'en-CA');

  // ВАЖНО: динамический роут матчится на любой slug,
  // поэтому 404 делаем только через notFound при отсутствии в Strapi.
  try {
    const category = await getCategoryDataBySlug(slug, locale);

    if (!category) {
      return { notFound: true };
    }

    const products = await fetchProductsByCategorySlug(slug, locale);

    return {
      props: {
        category,
        products,
        error: false,
      },
    };
  } catch (e) {
    console.error('[CATEGORY ROUTE] ERROR:', e);
    return {
      props: {
        products: [],
        error: true,
        title: slug,
        description: null,
        bannerImage: null,
        bannerAlt: null,
      },
    };
  }
};

export default function CategoryArchive({ category, products, error, title: errorTitle, description: errorDescription }: Props) {
  // Показываем страницу ошибки, если была ошибка при загрузке
  if (error || !category) {
    return (
      <>
        <Head>
          <title>Category Error | Eurodib</title>
        </Head>
        <div style={{ padding: 40 }}>
          <h1>Category load error</h1>
          <p>Strapi request failed on server. Check Next.js terminal logs.</p>
          {errorTitle && <p>Slug: {errorTitle}</p>}
        </div>
      </>
    );
  }

  const filterConfig = prepareFilterConfig(products);

  const title = category.seoTitle || category.name;
  const description = category.seoDescription || category.description || '';

  return (
    <>
      <Head>
        <title>{title} | Eurodib</title>
        {description ? <meta name="description" content={description} /> : null}
        <link rel="stylesheet" href="/CSS/archive-products.css" />
        <link rel="stylesheet" href="/CSS/responsive.css" />
      </Head>

      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.name },
        ]}
      />

      <ArchiveTemplate
        title={category.name}
        description={category.description || ''}
        products={products}
        filterConfig={filterConfig}
        bannerImage={category.bannerImage || undefined}
        bannerAlt={category.bannerAlt || undefined}
        error={error}
      />
    </>
  );
}
