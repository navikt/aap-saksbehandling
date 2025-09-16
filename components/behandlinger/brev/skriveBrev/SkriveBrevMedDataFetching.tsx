import { SaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKolonne';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import {
  hentAktivitetsplikt11_7Grunnlag,
  hentBrevGrunnlag,
  hentFullmektigGrunnlag,
  hentRefusjonGrunnlag,
  hentSykdomsvurderingBrevGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from './SkriveBrevMedDataFetching.module.css';
import { StegType, TypeBehandling } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { skrivBrevBehovstype } from 'components/brev/BrevKortMedDataFetching';
import { BrevOppsummering } from 'components/behandlinger/brev/skriveBrev/BrevOppsummering';
import { mapGrunnlagTilMottakere } from 'lib/utils/brevmottakere';

export const SkriveBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  aktivtSteg,
  behandlingstype,
}: {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
  behandlingstype: TypeBehandling;
}) => {
  const [
    brevGrunnlag,
    refusjonGrunnlag,
    sykdomsvurderingBrevGrunnlag,
    fullmektigGrunnlag,
    aktivitetsplikt11_7Grunnlag,
  ] = await Promise.all([
    hentBrevGrunnlag(behandlingsReferanse),
    hentRefusjonGrunnlag(behandlingsReferanse),
    hentSykdomsvurderingBrevGrunnlag(behandlingsReferanse),
    hentFullmektigGrunnlag(behandlingsReferanse),
    hentAktivitetsplikt11_7Grunnlag(behandlingsReferanse),
  ]);
  if (
    isError(refusjonGrunnlag) ||
    isError(sykdomsvurderingBrevGrunnlag) ||
    isError(brevGrunnlag) ||
    isError(fullmektigGrunnlag) ||
    isError(aktivitetsplikt11_7Grunnlag)
  ) {
    return (
      <ApiException
        apiResponses={[
          refusjonGrunnlag,
          brevGrunnlag,
          sykdomsvurderingBrevGrunnlag,
          fullmektigGrunnlag,
          aktivitetsplikt11_7Grunnlag,
        ]}
      />
    );
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
        refusjonGrunnlag={refusjonGrunnlag.data}
        sykdomsvurderingBrevGrunnlag={sykdomsvurderingBrevGrunnlag.data}
        aktivitetsplikt11_7Grunnlag={
          behandlingstype === 'Aktivitetsplikt' ? aktivitetsplikt11_7Grunnlag.data : undefined
        }
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
