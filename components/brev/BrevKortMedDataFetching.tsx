import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
}

export const BrevKortMedDataFetching = async ({ behandlingReferanse, behandlingVersjon }: Props) => {
  const grunnlagene = await hentBrevGrunnlag(behandlingReferanse);

  const grunnlag = grunnlagene.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');
  if (!grunnlag || !grunnlagene.harTilgangTilÅSaksbehandle) {
    return null;
  }
  const brev = grunnlag.brev;
  const mottaker = grunnlag.mottaker;
  const brevbestillingReferanse = grunnlag.brevbestillingReferanse;
  const status = grunnlag.status;

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
        />
      )}
    </VilkårsKort>
  );
};
