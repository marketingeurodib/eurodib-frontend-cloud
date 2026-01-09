// Redirect from /sing-in to /auth/sign-in
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/auth/sign-in',
      permanent: false,
    },
  };
};

export default function SingInRedirect() {
  return null;
}
