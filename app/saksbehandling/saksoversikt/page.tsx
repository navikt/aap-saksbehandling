import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { OpprettSakLocal } from 'components/opprettsak/OpprettSakLocal';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';
import { SimulerJournalpostHendelse } from 'components/opprettsak/SimulerJournalpostHendelse';
import { Suspense } from 'react';
import { PageBlock } from '@navikt/ds-react/Page';
import { Link, Page } from '@navikt/ds-react';
import { redirect } from 'next/navigation';

const SaksoversiktPage = async () => {
  if (isProd()) {
    redirect('/oppgave');
  }

  return (
    <Page>
      <PageBlock width="2xl">
        {isLocal() && <Link href="/postmottak">Utviklerverktøy – Se postmottak-behandlinger</Link>}
        {isLocal() && <OpprettSakLocal />}
        {isDev() && <OpprettSakTest />}
        {isLocal() && <SimulerJournalpostHendelse />}

        {!isProd() && (
          <Suspense>
            <AlleSakerListe />
          </Suspense>
        )}
      </PageBlock>
    </Page>
  );
};

export default SaksoversiktPage;
