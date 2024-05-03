import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { OpprettSak } from 'components/opprettsak/OpprettSak';
import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';
import { isLocal } from 'lib/utils/environment';
import { Button } from '@navikt/ds-react';
import { rekjørFeiledeOppgaver } from 'lib/clientApi';

const Page = async () => {
  const alleSaker = await hentAlleSaker();
  return (
    <main className={styles.main}>
      <Button onClick={async () => await rekjørFeiledeOppgaver()}>Rekjør feilede oppgaver</Button>
      {isLocal() && <OpprettSak />}
      <AlleSakerListe alleSaker={alleSaker} />
    </main>
  );
};

export default Page;
