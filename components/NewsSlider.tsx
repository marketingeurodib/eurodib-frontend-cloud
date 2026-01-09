// components/NewsSlider.tsx

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { fetchBlogPosts, fetchFeaturedBlogPosts, type BlogPostCard } from '../lib/api/blogPosts';

// базовые стили Swiper
import 'swiper/css';
import 'swiper/css/pagination';

interface NewsItem {
  title: string;
  text: string;
  image: string;
  href: string;
  alt?: string;
}

const defaultNews: NewsItem[] = [
  {
    title: 'A Michelin Star',
    text: "Quebec's chef puts a milestone",
    image: 'https://eurodib.com/wp-content/uploads/2024/01/Mask-group1.png',
    href: '/news',
    alt: 'Professional chef in kitchen celebrating Michelin star achievement - Eurodib culinary excellence',
  },
  {
    title: 'The best waffle recipe',
    text: "You're in for a treat!",
    image: '/image/blog2.png',
    href: '/news',
    alt: 'Delicious golden waffles made with professional Eurodib waffle making equipment',
  },
  {
    title: 'Our reps on a special visit',
    text: 'Great news to come with new products',
    image: '/image/Blog3.png',
    href: '/news',
    alt: 'Eurodib sales representatives visiting customers with new professional kitchen equipment',
  },
];

interface NewsSliderProps {
  title?: string;
  limit?: number;
  featuredOnly?: boolean;
}

const NewsSlider: FC<NewsSliderProps> = ({ title, limit, featuredOnly }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNews);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Если переданы пропсы, загружаем данные из Strapi
    if (title !== undefined || limit !== undefined || featuredOnly !== undefined) {
      setIsLoading(true);
      const fetchNews = async () => {
        try {
          const posts = featuredOnly
            ? await fetchFeaturedBlogPosts()
            : await fetchBlogPosts();
          
          const limitedPosts = limit ? posts.slice(0, limit) : posts;
          
          const items: NewsItem[] = limitedPosts.map((post) => ({
            title: post.title,
            text: post.excerpt,
            image: post.imageUrl,
            href: `/blog/${post.slug}`,
            alt: post.imageAlt,
          }));
          
          setNewsItems(items.length > 0 ? items : defaultNews);
        } catch (error) {
          console.error('[NewsSlider] Error fetching blog posts:', error);
          setNewsItems(defaultNews);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchNews();
    }
  }, [title, limit, featuredOnly]);

  const displayTitle = title || 'Latest News';
  if (isLoading) {
    return (
      <section className="news-cards-section">
        <h2 className="news-cards-title">{displayTitle}</h2>
        <div className="news-cards-slider swiper">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news-cards-section">
      <h2 className="news-cards-title">{displayTitle}</h2>

      {/* один контейнер, работает как grid на десктопе и как Swiper на мобилке */}
      <div className="news-cards-slider swiper">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={3}
          spaceBetween={24}
          centeredSlides={false}
          loop={false}
          speed={350}
          roundLengths={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            el: '.news-pagination',
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.15,
              spaceBetween: 14,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 18,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
              centeredSlides: false,
            },
          }}
        >
          {newsItems.map((item, index) => (
            <SwiperSlide key={`${item.title}-${index}`}>
              <article className="news-card">
                <div className="news-card-img-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
                  <Image
                    className="news-card-img"
                    src={item.image}
                    alt={item.alt || item.title}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                    priority={index === 0}
                  />
                </div>
                <div className="news-card-content">
                  <h3 className="news-card-heading">{item.title}</h3>
                  <p className="news-card-text">{item.text}</p>
                  <Link href={item.href} className="news-card-btn">
                    Read More
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* пагинация появляется только на мобилке */}
        <div className="swiper-pagination news-pagination"></div>
      </div>
    </section>
  );
};

export default NewsSlider;

