import {
  hentRettighetsinfo,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SakOversiktContainer } from 'components/saksoversikt/SakOversiktContainer';
import { Suspense } from 'react';
import { isSuccess } from 'lib/utils/api';
import { hentArenaSakerForPerson } from 'lib/services/apiinternservice/apiInternService';
import { unleashService } from 'lib/services/unleash/unleashService';
import { Box } from '@navikt/ds-react';

const Page = async (props: { params: Promise<{ saksnummer: string }> }) => {
  const params = await props.params;
  const [sak, personInfo, rettihetsinfoRes] = await Promise.all([
    hentSak(params.saksnummer),
    hentSakPersoninfo(params.saksnummer),
    hentRettighetsinfo(params.saksnummer),
  ]);
  const rettighetsinfo = isSuccess(rettihetsinfoRes) ? rettihetsinfoRes.data : null;

  const visArenasakerOversikt = unleashService.isEnabled('VisArenasakerOversikt');
  const arenaSakerRes = visArenasakerOversikt ? await hentArenaSakerForPerson(personInfo.fnr) : undefined;
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
