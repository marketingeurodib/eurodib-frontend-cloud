// Redirect from /resource-center to /account/resource-center
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/resource-center',
      permanent: false,
    },
  };
};

export default function ResourceCenterRedirect() {
  return null;
}
