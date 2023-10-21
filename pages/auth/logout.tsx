// Next
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

export type LogoutPageProps = {};

export const getServerSideProps: GetServerSideProps<LogoutPageProps> = async (
  context: GetServerSidePropsContext,
) => {
  context.res.setHeader(
    'Set-Cookie',
    'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );

  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
    props: {},
  };
};

export default function LogoutPage({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return <div>Logging out...</div>;
}
