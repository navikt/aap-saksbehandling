import { HGrid, Skeleton } from '@navikt/ds-react';

import { Kort } from 'components/oppgavebehandling/kort/Kort';
import { Køvelger } from 'components/oppgavebehandling/køvelger/Køvelger';
import { HøyreKolonne } from 'components/oppgavebehandling/høyrekolonne/Høyrekolonne';
import { OppgavekMedDatafetching } from 'components/oppgavebehandling/oppgavekø/OppgavekøMedDatafetching';
import { Suspense } from 'react';

import styles from './page.module.css';

const Page = () => {
  return (
    <main className={styles.content}>
      <HGrid gap={'8'} columns={'4fr 1fr'}>
        <HGrid>
          <Kort>
            <Køvelger />
            <Suspense fallback={<Skeleton variant={'rectangle'} height={380} className={styles.oppgavekø} />}>
              <OppgavekMedDatafetching />
            </Suspense>
          </Kort>
        </HGrid>
        <HøyreKolonne />
      </HGrid>
    </main>
  );
};

export default Page;
