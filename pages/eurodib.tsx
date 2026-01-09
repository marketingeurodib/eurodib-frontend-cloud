// Redirect from /eurodib to /brands/eurodib
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/brands/eurodib',
      permanent: false,
    },
  };
};

export default function EurodibRedirect() {
  return null;
}
