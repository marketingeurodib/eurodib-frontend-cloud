// components/HeroSlider.tsx

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// базовые стили Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface HeroSlide {
  bg: string;
  title1: string;
  title2: string;
  text: string;
  image: string;
  href: string;
}

interface HomeHeroSlide {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  sortOrder?: number;
}

const defaultSlides: HeroSlide[] = [
  {
    bg: '/image/slide01.png',
    title1: 'Ice cubes',
    title2: 'Perfect for every sip',
    text: 'The new ice machine from Brema will save you a lot of energy.',
    image: '/image/ice-cubes.png',
    href: '/archive-page',
  },
  {
    bg: '/image/hero-slider/Euro_web_carrousel_Brema.png',
    title1: 'Ice cubes',
    title2: 'Perfect for every sip',
    text: 'The new ice machine from Brema will save you a lot of energy.',
    image: '/image/ice-cubes.png',
    href: '/archive-page',
  },
  {
    bg: '/image/hero-slider/Euro_web_carrousel_Lamber.png',
    title1: 'Ice cubes',
    title2: 'Perfect for every sip',
    text: 'The new ice machine from Brema will save you a lot of energy.',
    image: '/image/ice-cubes.png',
    href: '/archive-page',
  },
  {
    bg: '/image/hero-slider/Euro_web_carrousel_Nemox.png',
    title1: 'Ice cubes',
    title2: 'Perfect for every sip',
    text: 'The new ice machine from Brema will save you a lot of energy.',
    image: '/image/ice-cubes.png',
    href: '/archive-page',
  },
];

interface HeroSliderProps {
  slides?: HomeHeroSlide[];
}

const HeroSlider: FC<HeroSliderProps> = ({ slides }) => {
  // Преобразуем HomeHeroSlide в HeroSlide для совместимости с текущим дизайном
  const displaySlides: HeroSlide[] = slides && slides.length > 0
    ? slides.map((s) => {
        // Разделяем title на title1 и title2 по переносу строки или берем subtitle
        const titleParts = s.title.split('\n');
        const title1 = titleParts[0] || s.title;
        const title2 = s.subtitle || titleParts[1] || '';
        
        return {
          bg: s.imageUrl,
          title1,
          title2,
          text: s.subtitle || '',
          image: s.imageUrl,
          href: s.ctaUrl || '/archive-page',
        };
      })
    : defaultSlides;
  return (
    <section className="slider-section">
      <Swiper
        className="mySwiper"
        modules={[Pagination, Autoplay]}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        speed={600}
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="swiper-slide-bg"
              style={{
                backgroundImage: `url('${slide.bg}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <div className="slide-inner horizontal-layout">
                <div className="slide-text white">
                  {index === 0 ? (
                    <h1>
                      <strong>{slide.title1}</strong>
                      <br />
                      <strong>{slide.title2}</strong>
                    </h1>
                  ) : (
                    <h2>
                      <strong>{slide.title1}</strong>
                      <br />
                      <strong>{slide.title2}</strong>
                    </h2>
                  )}
                  <p>{slide.text}</p>
                  <Link href={slide.href} className="btn white-outline">
                    Read More
                  </Link>
                </div>
                <div className="slide-image" style={{ position: 'relative' }}>
                  <Image
                    src={slide.image}
                    alt={`${slide.title1} ${slide.title2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="slide-image-img"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;

