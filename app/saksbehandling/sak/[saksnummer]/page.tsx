import { Box } from '@navikt/ds-react/Box';
import { logError, logWarning } from 'lib/serverutlis/logger';
import { hentArenaSakerForPerson } from 'lib/services/apiinternservice/apiInternService';
import {
  hentRettighetsinfo,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { unleashService } from 'lib/services/unleash/unleashService';
import { isSuccess } from 'lib/utils/api';
import { erIngenTilgangError } from 'lib/utils/ingenTilgang';
import { Suspense } from 'react';

import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';

const Page = async (props: { params: Promise<{ saksnummer: string }> }) => {
  const params = await props.params;
  const [sak, personInfo, rettihetsinfoRes] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentRettighetsinfo(params.saksnummer),
  ]).catch((err) => {
    if (erIngenTilgangError(err)) {
      logWarning(`Ingen tilgang til saksoversikt for ${params.saksnummer}`);
    } else {
      logError(`Feil i Promise.all ved henting av saksoversikt for ${params.saksnummer}`, err);
    }
    throw err;
  });
  const rettighetsinfo = isSuccess(rettihetsinfoRes) ? rettihetsinfoRes.data : null;

  const visArenasakerOversikt = unleashService.isEnabled('VisArenasakerOversikt');
  const arenaSakerRes = await (async () => {
    try {
      return visArenasakerOversikt ? await hentArenaSakerForPerson(personInfo.fnr) : undefined;
    } catch (err) {
      logError(`Feil ved henting av Arena-saker for sak ${params.saksnummer}`, err);
      throw err;
    }
  })();
  const arenaSaker = isSuccess(arenaSakerRes) ? arenaSakerRes.data : null;

  return (
    <Box background="neutral-soft">
      <SaksinfoBanner sak={sak} />

      <br />

      <Suspense>
        <SakOversiktContainer sak={sak} rettighetsinfo={rettighetsinfo} arenaSaker={arenaSaker} />
      </Suspense>
    </Box>
  );
};

export default Page;
