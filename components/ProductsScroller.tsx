import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

type EssentialsItem = {
  title: string;
  subtitle?: string;
  linkUrl: string;
  imageUrl: string;
  imageAlt: string;
  sortOrder?: number;
};

type ProductsScrollerProps = {
  title?: string;
  items?: EssentialsItem[];
};

export default function ProductsScroller({
  title = 'Our Essentials',
  items = [],
}: ProductsScrollerProps) {
  const sorted = [...items].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)
  );

  return (
    <section className="products-scroller">
      <h2 className="products-scroller__title">{title}</h2>

      <div className="products-scroller__inner">
        <Swiper
          className="myProductsSwiper"
          modules={[Navigation, Scrollbar]}
          slidesPerView="auto"
          spaceBetween={24}
          navigation
          scrollbar={{ draggable: true }}
          watchOverflow
        >
          {sorted.map((p, idx) => (
            <SwiperSlide className="product-card" key={`${p.linkUrl}-${idx}`}>
              <div className="product-card__media">
                <Image
                  src={p.imageUrl}
                  alt={p.imageAlt || p.title}
                  fill
                  sizes="375px"
                  className="product-card-img"
                />
              </div>

              <div className="product-info">
                <h4 className="product-title">{p.title}</h4>
                {p.subtitle ? <p className="product-subtitle">{p.subtitle}</p> : null}
              </div>

              <Link className="read-more-btn" href={p.linkUrl || '/archive-page'}>
                Read More
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
