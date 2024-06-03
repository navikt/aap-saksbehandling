import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';
import { isLocal } from 'lib/utils/environment';
import { OpprettSak } from 'components/opprettsak/OpprettSak';
import { LinkPanel } from '@navikt/ds-react';

const Page = async () => {
  const alleSaker = await hentAlleSaker();
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSak />}
      <LinkPanel href={'/oppgaveliste'}>
        Trykk her for å komme til oppgavelisten som oppgavestyring jobber med =)
      </LinkPanel>
      <AlleSakerListe alleSaker={alleSaker} />
    </main>
  );
};

export default Page;
