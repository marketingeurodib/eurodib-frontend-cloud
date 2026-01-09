// Redirect from /Book-a-training to /account/book-a-training
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account/book-a-training',
      permanent: false,
    },
  };
};

export default function BookATrainingRedirect() {
  return null;
}
