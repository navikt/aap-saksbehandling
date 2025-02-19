import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
}

export const BrevKortMedDataFetching = async ({ behandlingReferanse, behandlingVersjon }: Props) => {
  const grunnlag = await hentBrevGrunnlag(behandlingReferanse);

  const brev = grunnlag.brevGrunnlag[0]?.brev;
  const mottaker = grunnlag.brevGrunnlag[0]?.mottaker;
  const brevbestillingReferanse = grunnlag.brevGrunnlag[0]?.brevbestillingReferanse;

  return (
    <VilkårsKort
      heading={'Skriv brev'}
      steg="BREV"
      icon={<EnvelopeClosedIcon fontSize={'inherit'} aria-hidden />}
      defaultOpen={true}
    >
      {brev && (
        <SkriveBrev
          grunnlag={brev}
          mottaker={mottaker}
          behandlingVersjon={behandlingVersjon}
          referanse={brevbestillingReferanse}
        />
      )}
    </VilkårsKort>
  );
};
