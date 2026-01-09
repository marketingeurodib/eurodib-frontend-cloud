// Redirect from /Career-v2 to /careers/career-v2
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/careers/career-v2',
      permanent: false,
    },
  };
};

export default function CareerV2Redirect() {
  return null;
}
