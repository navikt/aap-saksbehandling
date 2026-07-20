import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Box } from '@navikt/ds-react/Box';
import { Link } from '@navikt/ds-react/Link';
import { Page as AkselPage } from '@navikt/ds-react/Page';
import { PageBlock } from '@navikt/ds-react/Page';
import { BodyShort } from '@navikt/ds-react/Typography';
import { hentAlleBehandlinger } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { redirect } from 'next/navigation';

import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';
import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';
import styles from 'components/postmottak/test/behandling/OpprettBehandling.module.css';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

const Page = async () => {
  if (isProd()) {
    return redirect('/oppgave');
  }

  const res = await hentAlleBehandlinger();
  if (isError(res)) {
    return <ApiException apiResponses={[res]} />;
  }

  const alleBehandlinger = res.data.sort((a, b) => Date.parse(b.opprettet) - Date.parse(a.opprettet));

  return (
    <AkselPage>
      <BehandlingOversikt behandlinger={alleBehandlinger} />
      {isLocal() && <OpprettBehandling />}
      {isDev() && (
        <PageBlock width="xl" className={styles.stickyFooterWrapper}>
          <Box className={styles.stickyFooter} padding="space-32">
            <BodyShort>Ved behov for ny journalpost kan det opprettet i Gosys testdata</BodyShort>
            <Link href="https://testdata-frontend.intern.dev.nav.no/" target="_blank">
              Opprett journalpost
              <ExternalLinkIcon />
            </Link>
          </Box>
        </PageBlock>
      )}
    </AkselPage>
  );
};

export default Page;
