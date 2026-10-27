import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { VilkårsKort } from 'components/vilkaarskort/Vilkårskort';
import { hentBrevGrunnlag, hentFullmektigGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { AvklaringsbehovKode, BrevBehovstype, StegType } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype, mapBehovskodeTilBehovstype } from 'lib/utils/form';
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
  const brevtekst = mapBehovskodeTilBehovstype(behovstype);
  const brukerMottaker = { ident: mottaker.ident || '', navn: mottaker.navn || '' }; // Midlertidig
  const { bruker, fullmektig } = mapGrunnlagTilMottakere(brukerMottaker, fullmektigGrunnlag.data.vurdering);

  return (
    <VilkårsKort heading={brevtekst} steg="BREV" defaultOpen={true} aktivMarkering={!readOnly}>
      {brev && (
        <SkriveBrev
          status={status}
          grunnlag={brev}
          mottaker={mottaker}
          bruker={grunnlag.bruker}
          brukerMottaker={bruker}
          kopimottaker={grunnlag.kopimottaker}
          fullmektigMottaker={fullmektig}
          behandlingVersjon={behandlingVersjon}
          referanse={brevbestillingReferanse}
          visAvbryt={visAvbryt}
          behovstype={behovstype}
          signaturer={grunnlag.signaturer}
          readOnly={readOnly}
          brevtype={grunnlag.brevtype}
        />
      )}
    </VilkårsKort>
  );
};

export function skrivBrevBehovstype(avklaringsbehovKode: AvklaringsbehovKode): BrevBehovstype {
  switch (avklaringsbehovKode) {
    case Behovstype.SKRIV_VEDTAKSBREV_KODE:
      return Behovstype.SKRIV_VEDTAKSBREV_KODE;
    case Behovstype.SKRIV_VEDTAKSBREV_SAKSBEHANDLER_KODE:
      return Behovstype.SKRIV_VEDTAKSBREV_SAKSBEHANDLER_KODE;
    case Behovstype.SKRIV_FORHÅNDSVARSEL_AKTIVITETSPLIKT_BREV_KODE:
      return Behovstype.SKRIV_FORHÅNDSVARSEL_AKTIVITETSPLIKT_BREV_KODE;
    case Behovstype.SKRIV_FORHÅNDSVARSEL_KLAGE_FORMKRAV_BREV_KODE:
      return Behovstype.SKRIV_FORHÅNDSVARSEL_KLAGE_FORMKRAV_BREV_KODE;
    default:
      return Behovstype.SKRIV_BREV_KODE;
  }
}
