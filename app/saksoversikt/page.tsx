import Link from 'next/link';

import { OpprettSakButton } from 'components/OpprettSakButton';

import { hentAlleSaker } from '../../lib/api';

const Page = async () => {
  const alleSaker = await hentAlleSaker();
  return (
    <>
      <h1>Saksoversikt page</h1>
      <OpprettSakButton />
      {alleSaker?.map((sak) => (
        <div key={sak.saksnummer}>
          <Link href={`/sak/${sak.saksnummer}/`}>{sak.saksnummer}</Link>
        </div>
      ))}
    </>
  );
};

export default Page;
