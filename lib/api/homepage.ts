// lib/api/homepage.ts
import { absoluteMediaUrl, strapiGet } from './strapiClient';
import { localeToStrapiLocale, type SupportedLocale } from '../utils/locale';

function pickMediaUrl(m: any): string | null {
  // Strapi v5: медиа может быть объектом с url напрямую
  // или вложенной структурой data.attributes.url
  const url = 
    m?.url || 
    m?.data?.url ||
    m?.data?.attributes?.url || 
    m?.attributes?.url || 
    null;
  
  if (typeof window === 'undefined' && m && !url) {
    console.log('[HOMEPAGE] pickMediaUrl: no URL found, media keys:', Object.keys(m || {}));
  }
  
  return absoluteMediaUrl(url);
}

export type HomeHeroSlide = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  sortOrder?: number;
};

export type HomeCategoryCard = {
  title?: string;
  linkUrl: string;
  imageUrl: string;
  imageAlt: string;
};

export type HomeBrandItem = {
  name: string;
  slug: string;
  logoUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type HomeAboutSection = {
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  logoUrl?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export type HomeFeatureBox = {
  title: string;
  iconUrl: string;
  ctaLabel: string;
  ctaUrl: string;
};

export type HomeSeo = {
  title?: string;
  description?: string;
  ogImageUrl?: string;
};

export type HomePageData = {
  seo: HomeSeo;

  // UI-friendly names used by index.tsx
  heroSlides: HomeHeroSlide[];
  categoryTitle?: string;
  categories: HomeCategoryCard[];
  brandsTitle?: string;
  brands: HomeBrandItem[];
  about?: HomeAboutSection;
  features: HomeFeatureBox[];

  essentialsTitle?: string;
  essentialsItems: Array<{
    title: string;
    subtitle?: string;
    linkUrl: string;
    imageUrl: string;
    imageAlt: string;
    sortOrder?: number;
  }>;

  homeBlogTitle?: string;
  homeBlogLimit?: number;
  homeBlogFeaturedOnly?: boolean;
};

export async function fetchHomepage(locale?: SupportedLocale | string): Promise<HomePageData> {
  // Пробуем разные варианты именования эндпоинта
  const possibleEndpoints = [
    '/api/homepage',
    '/api/home-page',
    '/api/home',
  ];

  const params = new URLSearchParams();

  // IMPORTANT: populate keys must match Strapi keys (heroSlide, categoryCard, ...)
  params.set('populate[seo][populate]', 'ogImage');
  params.set('populate[heroSlide][populate]', 'image');
  params.set('populate[categoryCard][populate]', 'image');
  params.set('populate[brandItem][populate]', 'logo');
  // Для aboutSection нужно указывать каждое поле отдельно
  params.set('populate[aboutSection][populate][image]', 'true');
  params.set('populate[aboutSection][populate][logo]', 'true');
  params.set('populate[featureBox][populate]', 'icon');
  params.set('populate[essentialsItems][populate]', 'image');

  // Конвертируем locale для Strapi (если это SupportedLocale)
  const strapiLocale = locale && typeof locale === 'string' && (locale === 'en-CA' || locale === 'fr-CA' || locale === 'en-US')
    ? localeToStrapiLocale(locale as SupportedLocale)
    : locale;
  
  if (strapiLocale) {
    params.set('locale', strapiLocale);
  }

  const queryString = params.toString();
  let json: any = null;

  for (const endpoint of possibleEndpoints) {
    try {
      const fullUrl = `${endpoint}?${queryString}`;
      
      // Логируем URL и параметры
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] ========== REQUEST DEBUG ==========');
        console.log('[HOMEPAGE] URL =>', fullUrl);
        console.log('[HOMEPAGE] Locale param:', strapiLocale || 'NOT SET (will use default)');
        console.log('[HOMEPAGE] Full query string:', queryString);
      }
      
      json = await strapiGet(fullUrl);
      
      // Логируем RAW JSON ответ
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] ========== RAW JSON RESPONSE ==========');
        console.log('[HOMEPAGE] data?', !!json?.data, 'locale=', strapiLocale || 'not set');
        console.log('[HOMEPAGE] json.data exists:', !!json?.data);
        console.log('[HOMEPAGE] json.data.attributes exists:', !!json?.data?.attributes);
        console.log('[HOMEPAGE] Response keys:', Object.keys(json || {}));
        console.log('[HOMEPAGE] Full RAW JSON (first 2000 chars):');
        console.log(JSON.stringify(json, null, 2).substring(0, 2000));
        console.log('[HOMEPAGE] ========================================');
      }
      
      // Если успешно получили данные, выходим из цикла
      if (json?.data || json?.data?.attributes) {
        break;
      }
    } catch (error: any) {
      // Если это не 404, выбрасываем ошибку сразу
      if (!error.message?.includes('404')) {
        throw error;
      }
      // Если 404, пробуем следующий endpoint
      continue;
    }
  }

  // Если все endpoint'ы вернули 404, возвращаем дефолтные значения
  if (!json || (!json?.data && !json?.data?.attributes)) {
    console.warn(
      `[HOMEPAGE] Endpoint not found in Strapi. Tried: ${possibleEndpoints.join(', ')}. ` +
      `Using default values. Please create the homepage content type in Strapi admin panel.`
    );
    return {
      seo: { title: 'EURODIB', description: '' },
      heroSlides: [],
      categoryTitle: 'Our Categories',
      categories: [],
      brandsTitle: 'Our Brands',
      brands: [],
      features: [],
    };
  }

  // Strapi v5: данные приходят напрямую в data (без attributes)
  // Проверяем оба варианта для совместимости
  const a = json?.data?.attributes || json?.data || {};
  
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] Data structure check:');
    console.log('  - json.data exists:', !!json?.data);
    console.log('  - json.data.attributes exists:', !!json?.data?.attributes);
    console.log('  - Using:', json?.data?.attributes ? 'data.attributes' : 'data');
    console.log('  - Available keys in a:', Object.keys(a));
  }

  // Read from Strapi keys:
  const heroSlide = Array.isArray(a?.heroSlide) ? a.heroSlide : [];
  const categoryCard = Array.isArray(a?.categoryCard) ? a.categoryCard : [];
  const brandItem = Array.isArray(a?.brandItem) ? a.brandItem : [];
  const featureBox = Array.isArray(a?.featureBox) ? a.featureBox : [];
  const essentialsItemsRaw = Array.isArray(a?.essentialsItems) ? a.essentialsItems : [];

  // Логируем что получили
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] ========== PARSING START ==========');
    console.log('[HOMEPAGE] Raw arrays from Strapi:', {
      heroSlide: heroSlide.length,
      categoryCard: categoryCard.length,
      brandItem: brandItem.length,
      featureBox: featureBox.length,
    });
    if (heroSlide.length > 0) {
      console.log('[HOMEPAGE] First heroSlide structure:', JSON.stringify(heroSlide[0], null, 2).substring(0, 500));
    }
  }

  const ogImageUrl = pickMediaUrl(a?.seo?.ogImage);
  const seo: HomeSeo = {
    title: a?.seo?.title || '',
    description: a?.seo?.description || '',
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };

  const heroSlides: HomeHeroSlide[] = heroSlide
    .map((s: any) => {
      const imageUrl = pickMediaUrl(s?.image);
      
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] Processing heroSlide:', s?.title, 'imageUrl:', imageUrl ? 'OK' : 'MISSING');
      }
      
      const slide: HomeHeroSlide = {
        title: s?.title || '',
        imageUrl: imageUrl || '',
        imageAlt: s?.imageAlt || s?.title || 'Hero slide',
      };
      
      if (s?.subtitle) slide.subtitle = s.subtitle;
      if (s?.ctaLabel) slide.ctaLabel = s.ctaLabel;
      if (s?.ctaUrl) slide.ctaUrl = s.ctaUrl;
      if (s?.badge) slide.badge = s.badge;
      if (s?.sortOrder !== undefined && s?.sortOrder !== null) slide.sortOrder = s.sortOrder;
      
      return slide;
    })
    .filter((x: any) => {
      const hasImage = !!x.imageUrl;
      if (typeof window === 'undefined' && !hasImage) {
        console.log('[HOMEPAGE] Hero slide filtered (no image):', x.title);
      }
      return hasImage;
    });
  
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] Final heroSlides count:', heroSlides.length);
  }

  const categories: HomeCategoryCard[] = categoryCard
    .map((c: any) => {
      const imageUrl = pickMediaUrl(c?.image);
      
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] Processing categoryCard:', c?.title, 'imageUrl:', imageUrl ? 'OK' : 'MISSING');
      }
      
      return {
        title: c?.title || '',
        linkUrl: c?.linkUrl || '/archive-page',
        imageUrl: imageUrl || '',
        imageAlt: c?.imageAlt || c?.title || 'Category',
      };
    })
    .filter((x: any) => {
      const hasImage = !!x.imageUrl;
      if (typeof window === 'undefined' && !hasImage) {
        console.log('[HOMEPAGE] Category filtered (no image):', x.title);
      }
      return hasImage;
    });
  
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] Final categories count:', categories.length);
  }

  const brands: HomeBrandItem[] = brandItem
    .map((b: any) => {
      const slug = b?.slug || '';
      const logoUrl = pickMediaUrl(b?.logo) || '';
      
      if (typeof window === 'undefined' && (!logoUrl || !slug)) {
        console.log('[HOMEPAGE] Brand filtered out:', b?.name || 'untitled', 'slug:', slug, 'logoUrl:', !!logoUrl);
      }
      
      const brand: HomeBrandItem = {
        name: b?.name || '',
        slug: slug,
        logoUrl: logoUrl,
      };
      
      if (b?.isPrimary) brand.isPrimary = true;
      if (b?.sortOrder !== undefined && b?.sortOrder !== null) brand.sortOrder = b.sortOrder;
      
      return brand;
    })
    .filter((x: any) => !!x.logoUrl && !!x.slug);

  const about: HomeAboutSection | undefined = a?.aboutSection
    ? {
        title: a?.aboutSection?.title || '',
        text: a?.aboutSection?.text || '',
        imageUrl: pickMediaUrl(a?.aboutSection?.image) || '',
        imageAlt: a?.aboutSection?.imageAlt || a?.aboutSection?.title || 'About',
        logoUrl: pickMediaUrl(a?.aboutSection?.logo) || undefined,
        linkLabel: a?.aboutSection?.linkLabel || 'Read more >',
        linkUrl: a?.aboutSection?.linkUrl || '/about-us',
      }
    : undefined;

  const features: HomeFeatureBox[] = featureBox
    .map((f: any) => {
      const iconUrl = pickMediaUrl(f?.icon);
      
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] Processing featureBox:', f?.title, 'iconUrl:', iconUrl ? 'OK' : 'MISSING');
      }
      
      return {
        title: f?.title || '',
        iconUrl: iconUrl || '',
        ctaLabel: f?.ctaLabel || '',
        ctaUrl: f?.ctaUrl || '',
      };
    })
    .filter((x: any) => {
      const isValid = !!x.title && !!x.iconUrl && !!x.ctaUrl;
      if (typeof window === 'undefined' && !isValid) {
        console.log('[HOMEPAGE] Feature filtered:', x.title, 'title:', !!x.title, 'iconUrl:', !!x.iconUrl, 'ctaUrl:', !!x.ctaUrl);
      }
      return isValid;
    });
  
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] Final features count:', features.length);
    console.log('[HOMEPAGE] Final brands count:', brands.length);
    console.log('[HOMEPAGE] ========== PARSING END ==========');
  }

  // Обрабатываем essentialsItems
  const essentialsItems = essentialsItemsRaw
    .map((it: any) => {
      const imageUrl = pickMediaUrl(it?.image);
      
      if (typeof window === 'undefined') {
        console.log('[HOMEPAGE] Processing essentialsItem:', it?.title, 'imageUrl:', imageUrl ? 'OK' : 'MISSING');
      }
      
      const item: {
        title: string;
        subtitle?: string;
        linkUrl: string;
        imageUrl: string;
        imageAlt: string;
        sortOrder?: number;
      } = {
        title: it?.title || '',
        linkUrl: it?.linkUrl || '/archive-page',
        imageUrl: imageUrl || '',
        imageAlt: it?.imageAlt || it?.title || 'Essential item',
      };
      
      if (it?.subtitle) item.subtitle = it.subtitle;
      if (it?.sortOrder !== undefined && it?.sortOrder !== null) item.sortOrder = it.sortOrder;
      
      return item;
    })
    .filter((x: any) => x.title && x.imageUrl)
    .sort((x: any, y: any) => (x.sortOrder ?? 999) - (y.sortOrder ?? 999));
  
  if (typeof window === 'undefined') {
    console.log('[HOMEPAGE] Final essentialsItems count:', essentialsItems.length);
  }

  const result: HomePageData = {
    seo,
    heroSlides,
    categoryTitle: a?.categoryTitle || 'Our Categories',
    categories,
    brandsTitle: a?.brandsTitle || 'Our Brands',
    brands,
    features,
    essentialsTitle: a?.essentialsTitle || 'Our Essentials',
    essentialsItems,
  };

  if (about) {
    result.about = about;
  }

  if (a?.homeBlogTitle) {
    result.homeBlogTitle = a.homeBlogTitle;
  }

  if (a?.homeBlogLimit !== undefined && a?.homeBlogLimit !== null) {
    result.homeBlogLimit = a.homeBlogLimit;
  }

  if (a?.homeBlogFeaturedOnly !== undefined && a?.homeBlogFeaturedOnly !== null) {
    result.homeBlogFeaturedOnly = a.homeBlogFeaturedOnly;
  }

  return result;
}
