// Redirect from /create-account to /auth/create-account
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/auth/create-account',
      permanent: false,
    },
  };
};

export default function CreateAccountRedirect() {
  return null;
}
