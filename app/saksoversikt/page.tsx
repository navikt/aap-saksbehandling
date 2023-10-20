import { getToken } from 'lib/auth/authentication';
import { hentAlleSaker } from '../../lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { OpprettSak } from '../../components/opprettsak/OpprettSak';
import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

const Page = async () => {
  const alleSaker = await hentAlleSaker(getToken(headers()));
  return (
    <>
      <h1>Saksoversikt page</h1>
      <OpprettSak />
      <AlleSakerListe alleSaker={alleSaker} />
    </>
  );
};

export default Page;
