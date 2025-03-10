import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';
import { isLocal } from 'lib/utils/environment';
import { OpprettSak } from 'components/opprettsak/OpprettSak';

const Page = async () => {
  const alleSaker = await hentAlleSaker();
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSak />}
      <AlleSakerListe alleSaker={alleSaker} />
    </main>
  );
};

export default Page;
