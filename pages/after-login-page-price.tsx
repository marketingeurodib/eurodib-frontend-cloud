// Redirect from /after-login-page-price to /account/resource-center/price-lists
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/resource-center/price-lists',
      permanent: false,
    },
  };
};

export default function AfterLoginPagePriceRedirect() {
  return null;
}
