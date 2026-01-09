// Redirect from /account to /account (index.tsx will handle it)
// This file can be removed if Next.js automatically routes /account to /account/index.tsx
// Keeping it for explicit redirect if needed
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/account',
      permanent: false,
    },
  };
};

export default function AccountRedirect() {
  return null;
}
