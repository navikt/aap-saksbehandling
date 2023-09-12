import { getToken } from 'lib/auth/authentication';
import { hentAlleSaker } from 'lib/services/saksbehandlingService';
import { headers } from 'next/headers';
import Link from 'next/link';

import { OpprettSakButton } from 'components/OpprettSakButton';

const Page = async () => {
  const alleSaker = await hentAlleSaker(getToken(headers()));
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
