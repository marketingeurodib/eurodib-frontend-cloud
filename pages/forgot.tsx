// Redirect from /forgot to /auth/forgot
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/auth/forgot',
      permanent: false,
    },
  };
};

export default function ForgotRedirect() {
  return null;
}
