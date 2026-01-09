// components/BrandsSliderMobile.tsx

import { FC } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { CSSProperties } from 'react';

// базовые стили Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface HomeBrandItem {
  name: string;
  slug: string;
  logoUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

interface BrandsSliderMobileProps {
  brands?: HomeBrandItem[];
}

const BrandsSliderMobile: FC<BrandsSliderMobileProps> = ({ brands = [] }) => {
  // Если нет брендов, не показываем слайдер
  if (!brands || brands.length === 0) {
    return null;
  }

  // На мобильных показываем слайдер, на десктопе - скрыт через CSS
  return (
    <div className="edbbr2-slider swiper" aria-label="More brands">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={16}
        loop={brands.length > 1}
        speed={500}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        roundLengths={true}
        grabCursor={true}
        watchOverflow={true}
        pagination={{
          el: '.edbbr2-pagination',
          clickable: true,
        }}
      >
        {brands.map((brand, index) => (
          <SwiperSlide key={`${brand.slug}-${index}`}>
            <Link
              href={`/brands/${brand.slug}`}
              className="edbbr2-link"
              aria-label={brand.name}
            >
              <div
                className="edbbr2-logo"
                style={{ '--logo': `url('${brand.logoUrl}')` } as CSSProperties}
                role="img"
                aria-label={brand.name}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* пагинация для мобилы */}
      <div className="swiper-pagination edbbr2-pagination"></div>
    </div>
  );
};

export default BrandsSliderMobile;
