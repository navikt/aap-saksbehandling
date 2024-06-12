import { HGrid } from '@navikt/ds-react';

import { Kort } from 'components/oppgavebehandling/kort/Kort';
import { Køvelger } from 'components/oppgavebehandling/køvelger/Køvelger';

import styles from './page.module.css';
import { Oppgavekø } from 'components/oppgavebehandling/oppgavekø/Oppgavekø';
import { KøProvider } from 'components/oppgavebehandling/KøContext';
import { DineOppgaver } from 'components/oppgavebehandling/oppgavekø/DineOppgaver';

const Page = () => {
  return (
    <main className={styles.content}>
      <HGrid gap={'8'} columns={'1fr'}>
        <HGrid>
          <Kort>
            <KøProvider>
              <Køvelger />
              <DineOppgaver />
              <Oppgavekø />
            </KøProvider>
          </Kort>
        </HGrid>
      </HGrid>
    </main>
  );
};

export default Page;
