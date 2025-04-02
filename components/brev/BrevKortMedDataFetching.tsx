import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { StegType } from 'lib/types/types';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
}

export const BrevKortMedDataFetching = async ({ behandlingReferanse, behandlingVersjon, aktivtSteg }: Props) => {
  const [grunnlagene, brukerRoller] = await Promise.all([hentBrevGrunnlag(behandlingReferanse), hentRollerForBruker()]);

  const grunnlag = grunnlagene.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');
  if (!grunnlag || !grunnlagene.harTilgangTilÅSaksbehandle) {
    return null;
  }

  const brev = grunnlag.brev;
  const mottaker = grunnlag.mottaker;
  const brevbestillingReferanse = grunnlag.brevbestillingReferanse;
  const status = grunnlag.status;

  const readOnly = aktivtSteg === 'BREV' && !brukerRoller.includes(Roller.BESLUTTER);

  return (
    <VilkårsKort heading={'Skriv brev'} steg="BREV" defaultOpen={true}>
      {brev && (
        <SkriveBrev
          status={status}
          grunnlag={brev}
          mottaker={mottaker}
          behandlingVersjon={behandlingVersjon}
          referanse={brevbestillingReferanse}
          signaturer={grunnlag.signaturer}
          readOnly={readOnly}
        />
      )}
    </VilkårsKort>
  );
};
