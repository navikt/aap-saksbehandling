import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { OpprettSak } from 'components/opprettsak/OpprettSak';
import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';
import { isLocal } from 'lib/utils/environment';

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
