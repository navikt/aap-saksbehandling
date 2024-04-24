import { HGrid } from '@navikt/ds-react';

import { Kort } from 'components/oppgavebehandling/kort/Kort';
import { Køvelger } from 'components/oppgavebehandling/køvelger/Køvelger';

import styles from './page.module.css';
import { Oppgavekø } from 'components/oppgavebehandling/oppgavekø/Oppgavekø';
import { AktiveOppgaver } from 'components/oppgavebehandling/oppgavekø/AktiveOppgaver';

const Page = () => {
  return (
    <main className={styles.content}>
      <HGrid gap={'8'} columns={'1fr'}>
        <HGrid>
          <Kort>
            <Køvelger />
            <AktiveOppgaver />
            <Oppgavekø />
          </Kort>
        </HGrid>
      </HGrid>
    </main>
  );
};

export default Page;
