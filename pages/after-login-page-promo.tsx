// Redirect from /after-login-page-promo to /account/resource-center/promos
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/resource-center/promos',
      permanent: false,
    },
  };
};

export default function AfterLoginPagePromoRedirect() {
  return null;
}
