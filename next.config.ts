import type { NextConfig } from "next";

// Проверка загрузки конфига
console.log('NEXT CONFIG LOADED ✅');

// Получаем хост Strapi из env (для production)
// В dev: STRAPI_HOST=localhost (или не указывать)
// В prod: STRAPI_HOST=cms.yourdomain.com или strapi.yourdomain.com
const strapiHost = process.env.STRAPI_HOST || 'localhost';
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    // В dev отключаем оптимизацию для скорости итераций
    // В production включаем оптимизацию (unoptimized: false)
    unoptimized: isDev,
    
    // Domains для совместимости (работает с любым портом)
    domains: [
      strapiHost,
      '127.0.0.1',
      'localhost',
      'eurodib.com',
      'strapi.eurodib.com',
    ],
    
    // remotePatterns для production (БЕЗ port для совместимости)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eurodib.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'eurodib.com',
        pathname: '/**',
      },
      // Strapi production domain (из env или дефолт)
      {
        protocol: 'https',
        hostname: strapiHost,
        pathname: '/**',
      },
      // Strapi localhost (development) - БЕЗ port
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      // Strapi 127.0.0.1 (alternative localhost) - БЕЗ port
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/single-products',
        destination: '/products/CB249A%20BHC%20AWS',
        permanent: false,
      },
      {
        source: '/terms-and-conditions',
        destination: '/legal/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/legal/privacy-policy',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/legal/cookie-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
