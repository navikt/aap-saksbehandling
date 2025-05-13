import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { hentBrevGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { AvklaringsbehovKode, StegType } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
}

export const BrevKortMedDataFetching = async ({ behandlingReferanse, behandlingVersjon, aktivtSteg }: Props) => {
  const [grunnlagene, brukerRoller] = await Promise.all([hentBrevGrunnlag(behandlingReferanse), hentRollerForBruker()]);
  if (isError(grunnlagene)) {
    return <ApiException apiResponses={[grunnlagene]} />;
  }

  const grunnlag = grunnlagene.data.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');
  if (!grunnlag || !grunnlagene.data.harTilgangTilÅSaksbehandle) {
    return null;
  }

  const brev = grunnlag.brev;
  const mottaker = grunnlag.mottaker;
  const brevbestillingReferanse = grunnlag.brevbestillingReferanse;
  const status = grunnlag.status;

  const readOnly = aktivtSteg === 'BREV' && !brukerRoller.includes(Roller.BESLUTTER);

  const behovstype = skrivBrevBehovstype(grunnlag.avklaringsbehovKode)

  return (
    <VilkårsKort heading={'Skriv brev'} steg="BREV" defaultOpen={true}>
      {brev && (
        <SkriveBrev
          status={status}
          grunnlag={brev}
          mottaker={mottaker}
          behandlingVersjon={behandlingVersjon}
          referanse={brevbestillingReferanse}
          behovstype={behovstype}
          signaturer={grunnlag.signaturer}
          readOnly={readOnly}
        />
      )}
    </VilkårsKort>
  );
};

export function skrivBrevBehovstype(avklaringsbehovKode: AvklaringsbehovKode): Behovstype {
  switch (avklaringsbehovKode) {
    case Behovstype.SKRIV_VEDTAKSBREV_KODE:
      return Behovstype.SKRIV_VEDTAKSBREV_KODE;
    case Behovstype.SKRIV_FORHÅNDSVARSEL_AKTIVITETSPLIKT_BREV_KODE:
      return Behovstype.SKRIV_FORHÅNDSVARSEL_AKTIVITETSPLIKT_BREV_KODE;
    default:
      return Behovstype.SKRIV_BREV_KODE;
  }
}
