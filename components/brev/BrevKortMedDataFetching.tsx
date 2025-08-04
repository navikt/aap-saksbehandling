import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { hentBrevGrunnlag, hentFullmektigGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AvklaringsbehovKode, StegType } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { mapGrunnlagTilMottakere } from 'lib/utils/brevmottakere';

interface Props {
  behandlingReferanse: string;
  behandlingVersjon: number;
  visAvbryt?: boolean;
  aktivtSteg: StegType;
}

export const BrevKortMedDataFetching = async ({
  behandlingReferanse,
  behandlingVersjon,
  aktivtSteg,
  visAvbryt = true,
}: Props) => {
  const [grunnlagene, fullmektigGrunnlag] = await Promise.all([
    hentBrevGrunnlag(behandlingReferanse),
    hentFullmektigGrunnlag(behandlingReferanse),
  ]);

  if (isError(grunnlagene) || isError(fullmektigGrunnlag)) {
    return <ApiException apiResponses={[grunnlagene, fullmektigGrunnlag]} />;
  }

  const grunnlag = grunnlagene.data.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');

  if (!grunnlag) {
    return null;
  }

  const brev = grunnlag.brev;
  const mottaker = grunnlag.mottaker;
  const brevbestillingReferanse = grunnlag.brevbestillingReferanse;
  const status = grunnlag.status;
  const readOnly = aktivtSteg === 'BREV' && !grunnlag.harTilgangTilÅSendeBrev;
  const behovstype = skrivBrevBehovstype(grunnlag.avklaringsbehovKode);
  const { bruker, fullmektig } = mapGrunnlagTilMottakere(mottaker, fullmektigGrunnlag.data.vurdering);

  return (
    <VilkårsKort heading={'Skriv brev'} steg="BREV" defaultOpen={true}>
      {brev && (
        <SkriveBrev
          status={status}
          grunnlag={brev}
          mottaker={mottaker}
          brukerMottaker={bruker}
          fullmektigMottaker={fullmektig}
          behandlingVersjon={behandlingVersjon}
          referanse={brevbestillingReferanse}
          visAvbryt={visAvbryt}
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
    case Behovstype.SKRIV_FORHÅNDSVARSEL_KLAGE_FORMKRAV_BREV_KODE:
      return Behovstype.SKRIV_FORHÅNDSVARSEL_KLAGE_FORMKRAV_BREV_KODE;
    default:
      return Behovstype.SKRIV_BREV_KODE;
  }
}
