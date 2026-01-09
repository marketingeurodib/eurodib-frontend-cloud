// Redirect from /after-login-page-video to /account/resource-center/videos
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/resource-center/videos',
      permanent: false,
    },
  };
};

export default function AfterLoginPageVideoRedirect() {
  return null;
}
