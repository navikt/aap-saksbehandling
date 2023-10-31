import { getToken } from 'lib/auth/authentication';
import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { OpprettSak } from 'components/opprettsak/OpprettSak';
import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';

const Page = async () => {
  const alleSaker = await hentAlleSaker(getToken(headers()));
  return (
    <main className={styles.main}>
      <h1>Saksoversikt page</h1>
      <OpprettSak />
      <AlleSakerListe alleSaker={alleSaker} />
    </main>
  );
};

export default Page;
