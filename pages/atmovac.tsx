// Redirect from /atmovac to /brands/atmovac
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/brands/atmovac',
      permanent: false,
    },
  };
};

export default function AtmovacRedirect() {
  return null;
}
