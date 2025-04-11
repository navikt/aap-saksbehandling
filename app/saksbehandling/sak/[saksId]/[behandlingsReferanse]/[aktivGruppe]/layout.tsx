import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ReactNode, Suspense } from 'react';
import { StegGruppe } from 'lib/types/types';
import { BodyShort, Skeleton } from '@navikt/ds-react';

const Layout = async (props: {
  params: Promise<{ behandlingsReferanse: string; aktivGruppe: string }>;
  children: ReactNode;
}) => {
  const params = await props.params;

  const { children } = props;

  const flytResponse = await hentFlyt(params.behandlingsReferanse);
  const ferdigeSteg = flytResponse.flyt.filter((steg) => steg.erFullført).map((steg) => steg.stegGruppe);

  if (
    !ferdigeSteg.includes(params.aktivGruppe as StegGruppe) &&
    flytResponse.aktivGruppe != decodeURIComponent(params.aktivGruppe)
  ) {
    return <BodyShort>Dette steget er ikke vurdert enda.</BodyShort>;
  }

  return <Suspense fallback={<Skeleton variant="rectangle" height={'40vh'} />}>{children}</Suspense>;
};

export default Layout;
