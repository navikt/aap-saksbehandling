import { SaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKolonne';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import {
  hentBistandsbehovGrunnlag,
  hentBrevGrunnlag,
  hentFullmektigGrunnlag,
  hentRefusjonGrunnlag,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from './SkriveBrevMedDataFetching.module.css';
import { StegType } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { skrivBrevBehovstype } from 'components/brev/BrevKortMedDataFetching';
import { BrevOppsummering } from 'components/behandlinger/brev/skriveBrev/BrevOppsummering';
import { mapGrunnlagTilMottakere } from 'lib/utils/brevmottakere';

export const SkriveBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  aktivtSteg,
}: {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
}) => {
  const [brevGrunnlag, sykdomsgrunnlag, bistandsbehovGrunnlag, refusjonGrunnlag, fullmektigGrunnlag] =
    await Promise.all([
      hentBrevGrunnlag(behandlingsReferanse),
      hentSykdomsGrunnlag(behandlingsReferanse),
      hentBistandsbehovGrunnlag(behandlingsReferanse),
      hentRefusjonGrunnlag(behandlingsReferanse),
      hentFullmektigGrunnlag(behandlingsReferanse),
    ]);
  if (
    isError(sykdomsgrunnlag) ||
    isError(bistandsbehovGrunnlag) ||
    isError(refusjonGrunnlag) ||
    isError(brevGrunnlag) ||
    isError(fullmektigGrunnlag)
  ) {
    return <ApiException apiResponses={[sykdomsgrunnlag, bistandsbehovGrunnlag, refusjonGrunnlag, brevGrunnlag]} />;
  }

  const brev = brevGrunnlag.data.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');
  const sendteBrev = brevGrunnlag.data.brevGrunnlag.filter(
    (x) => x.status === 'FULLFØRT' && x.brev != null && x.avklaringsbehovKode === '5050'
  );
  const avbrytteBrev = brevGrunnlag.data.brevGrunnlag.filter(
    (x) => x.status === 'AVBRUTT' && x.brev != null && x.avklaringsbehovKode === '5050'
  );

  if (!brev?.brev) {
    return <BrevOppsummering sendteBrev={sendteBrev} avbrutteBrev={avbrytteBrev} />;
  }

  if (!brev?.brev) {
    return null;
  }

  const readOnlyBrev = aktivtSteg === 'BREV' && !brev.harTilgangTilÅSendeBrev;
  const behovstype = skrivBrevBehovstype(brev.avklaringsbehovKode);

  const { bruker, fullmektig } = mapGrunnlagTilMottakere(brev.mottaker, fullmektigGrunnlag.data.vurdering);

  return (
    <div className={styles.flex}>
      <SaksopplysningerKolonne
        sykdomsgrunnlag={sykdomsgrunnlag.data}
        bistandsbehovGrunnlag={bistandsbehovGrunnlag.data}
        refusjonGrunnlag={refusjonGrunnlag.data}
      />
      <SkriveBrev
        status={brev.status}
        referanse={brev.brevbestillingReferanse}
        behovstype={behovstype}
        grunnlag={brev.brev}
        mottaker={brev.mottaker}
        brukerMottaker={bruker}
        fullmektigMottaker={fullmektig}
        readOnly={readOnlyBrev}
        signaturer={brev.signaturer}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
