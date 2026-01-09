// Redirect from /after-login-page-orders to /account/orders
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/orders',
      permanent: false,
    },
  };
};

export default function AfterLoginPageOrdersRedirect() {
  return null;
}
