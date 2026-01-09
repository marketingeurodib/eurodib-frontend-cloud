import type { GetServerSideProps } from 'next';
import ArchiveBlogV2, { getServerSideProps as archiveGssp } from './archive-blogv2';

export const getServerSideProps: GetServerSideProps = archiveGssp;
export default ArchiveBlogV2;
