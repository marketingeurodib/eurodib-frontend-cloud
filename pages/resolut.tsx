// Redirect from /resolut to /brands/resolute
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/brands/resolute',
      permanent: false,
    },
  };
};

export default function ResolutRedirect() {
  return null;
}
