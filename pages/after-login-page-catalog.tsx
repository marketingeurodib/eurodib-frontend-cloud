// Redirect from /after-login-page-catalog to /account/resource-center/catalogues
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/resource-center/catalogues',
      permanent: false,
    },
  };
};

export default function AfterLoginPageCatalogRedirect() {
  return null;
}
