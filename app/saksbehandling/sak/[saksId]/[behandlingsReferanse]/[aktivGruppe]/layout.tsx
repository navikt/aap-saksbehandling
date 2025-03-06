import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ReactNode, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { StegGruppe } from 'lib/types/types';
import { Skeleton } from '@navikt/ds-react';

const Layout = async (
  props: {
    params: Promise<{ behandlingsReferanse: string; aktivGruppe: string }>;
    children: ReactNode;
  }
) => {
  const params = await props.params;

  const {
    children
  } = props;

  const flytResponse = await hentFlyt(params.behandlingsReferanse);
  const ferdigeSteg = flytResponse.flyt.filter((steg) => steg.erFullført).map((steg) => steg.stegGruppe);

  if (!ferdigeSteg.includes(params.aktivGruppe as StegGruppe) && flytResponse.aktivGruppe != params.aktivGruppe) {
    // TODO: Undersøke hva brukere ønsker dersom de går til en gruppe de ikke kan vurdere enda
    notFound();
  }

  return <Suspense fallback={<Skeleton variant="rectangle" height={'40vh'} />}>{children}</Suspense>;
};

export default Layout;
