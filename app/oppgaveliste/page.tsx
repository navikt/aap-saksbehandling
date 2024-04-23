import { HGrid } from '@navikt/ds-react';

import { Kort } from 'components/oppgavebehandling/kort/Kort';
import { Køvelger } from 'components/oppgavebehandling/køvelger/Køvelger';
import { HøyreKolonne } from 'components/oppgavebehandling/høyrekolonne/Høyrekolonne';

import styles from './page.module.css';
import { Oppgavekø } from 'components/oppgavebehandling/oppgavekø/Oppgavekø';

const Page = () => {
  return (
    <main className={styles.content}>
      <HGrid gap={'8'} columns={'4fr 1fr'}>
        <HGrid>
          <Kort>
            <Køvelger />
            <Oppgavekø />
          </Kort>
        </HGrid>
        <HøyreKolonne />
      </HGrid>
    </main>
  );
};

export default Page;
