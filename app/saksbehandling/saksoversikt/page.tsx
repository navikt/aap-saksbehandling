import { AlleSakerListe } from 'components/saksliste/AlleSakerListe';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import OpprettSakTest from 'components/opprettsak/OpprettSakTest';
import { UtviklerverktoyTabs } from 'components/opprettsak/UtviklerverktoyTabs';
import { Suspense } from 'react';
import { PageBlock } from '@navikt/ds-react/Page';
import { Page } from '@navikt/ds-react';
import { redirect } from 'next/navigation';

const SaksoversiktPage = async () => {
  if (isProd()) {
    redirect('/oppgave');
  }

  return (
    <Page>
      <PageBlock width="2xl">
        {isLocal() && <UtviklerverktoyTabs />}

        {isDev() && <OpprettSakTest />}

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
