import { Link } from '@navikt/ds-react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Kelvin</title>
      </Head>
      <main>
        <Link href={'/saksoversiktpage/SaksoversiktPage'}>Go to SAKSOVERSIKT</Link>
      </main>
    </>
  );
}
