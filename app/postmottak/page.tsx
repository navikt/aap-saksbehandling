import { BodyShort, Box, Link, Page as AkselPage } from '@navikt/ds-react';
import { BehandlingOversikt } from 'components/postmottak/oversikt/BehandlingOversikt';
import { isDev, isLocal, isProd } from 'lib/utils/environment';
import { hentAlleBehandlinger } from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { redirect } from 'next/navigation';
import { PageBlock } from '@navikt/ds-react/Page';
import styles from 'components/postmottak/test/behandling/OpprettBehandling.module.css';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { OpprettBehandling } from 'components/postmottak/test/behandling/OpprettBehandling';

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
