// lib/api/blog.ts
// TODO: Заменить mock-данные на реальный запрос к Strapi
// Пример: const res = await fetch(`${process.env.STRAPI_URL}/api/posts?sort[0]=publishedAt:desc&pagination[pageSize]=12&populate=cover`);

export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  // опционально — дата, теги и т.д.
  publishedAt?: string;
}

export async function fetchBlogPosts(): Promise<BlogListItem[]> {
  // TODO: заменить на реальный запрос в Strapi
  // Пример:
  // const res = await fetch(
  //   `${process.env.STRAPI_URL}/api/posts?sort[0]=publishedAt:desc&pagination[pageSize]=12&populate=cover`
  // );
  // const json = await res.json();
  // const posts: BlogListItem[] = json.data.map(mapFromStrapi);

  // Временная заглушка, чтобы страница уже работала
  return [
    {
      id: 1,
      slug: 'a-michelin-star',
      title: 'A Michelin Star',
      category: 'News',
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque euismod elementum convallis. Quisque rutrum tortor at elit feugiat egestas.',
      imageUrl:
        'http://eurodib.com/wp-content/uploads/2024/01/61614774167b867493a1c344572542cab277fe9a.jpg',
    },
    {
      id: 2,
      slug: 'best-waffle-recipe',
      title: 'The best waffle recipe',
      category: 'Recipes',
      excerpt: "You're in for a treat!",
      imageUrl:
        'http://eurodib.com/wp-content/uploads/2024/01/8c9e205dacab495a64a9a9eb2360195f98303989.png',
    },
    {
      id: 3,
      slug: 'our-reps-special-visit',
      title: 'Our reps on a special visit',
      category: 'On the road',
      excerpt: 'Great news to come with new products',
      imageUrl:
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    },
  ];
}

