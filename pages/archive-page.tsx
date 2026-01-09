import type { GetServerSideProps } from 'next';

/**
 * Редирект со старого URL /archive-page на новый /categories/ice-machines
 * Для обратной совместимости со старыми ссылками
 */
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/categories/ice-machines',
      permanent: true, // 301 редирект для SEO
    },
  };
};

export default function ArchivePage() {
  // Этот компонент никогда не рендерится из-за редиректа
  return null;
}
