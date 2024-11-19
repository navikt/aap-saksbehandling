import { logError } from '@navikt/aap-felles-utils';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export const SkriveBrevMedDataFetching = async ({ behandlingsReferanse }: { behandlingsReferanse: string }) => {
  const brevGrunnlag = await hentBrevGrunnlag(behandlingsReferanse);

  if (!brevGrunnlag.brev) {
    logError('Ikke noe brev definert i grunnlaget');
    return null;
  }

  return <SkriveBrev grunnlag={brevGrunnlag.brev} />;
};
