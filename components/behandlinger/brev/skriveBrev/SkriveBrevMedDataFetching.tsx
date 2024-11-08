import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

export const SkriveBrevMedDataFetching = async ({ behandlingsReferanse }: { behandlingsReferanse: string }) => {
  const brevGrunnlag = await hentBrevGrunnlag(behandlingsReferanse);
  console.log('brevGrunnlag', brevGrunnlag);

  return <SkriveBrev grunnlag={brevGrunnlag} />;
};
