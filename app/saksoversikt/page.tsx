import { hentAlleSaker } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';

import styles from './page.module.css';
import { isLocal } from 'lib/utils/environment';
import { OpprettSak } from 'components/opprettsak/OpprettSak';
import { LinkPanel } from '@navikt/ds-react';
import Link from 'next/link';

const Page = async () => {
  const alleSaker = await hentAlleSaker();
  return (
    <main className={styles.main}>
      {isLocal() && <OpprettSak />}
      <Link href={'/oppgaveliste'}>
        <LinkPanel>Trykk her for å komme til oppgavelisten som oppgavestyring jobber med =)</LinkPanel>
      </Link>
      <AlleSakerListe alleSaker={alleSaker} />
    </main>
  );
};

export default Page;
