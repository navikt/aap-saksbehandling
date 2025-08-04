import { StegType } from 'lib/types/types';
import {
  hentBrevGrunnlag,
  hentFormkravGrunnlag,
  hentFullmektigGrunnlag,
  hentKlagebehandlingKontorGrunnlag,
  hentKlagebehandlingNayGrunnlag,
  hentKlageresultat,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { skrivBrevBehovstype } from 'components/brev/BrevKortMedDataFetching';
import styles from 'components/behandlinger/brev/skriveBrev/SkriveBrevMedDataFetching.module.css';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import { KlagesaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/KlagesaksopplysningerKolonne';
import { BrevOppsummering } from 'components/behandlinger/brev/skriveBrev/BrevOppsummering';
import { mapGrunnlagTilMottakere } from 'lib/utils/brevmottakere';

export const SkriveKlageBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  aktivtSteg,
}: {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
}) => {
  const [brevGrunnlag, klageresultat, formkrav, klagebehandlingKontor, klagebehandlingNay, fullmektigGrunnlag, roller] =
    await Promise.all([
      hentBrevGrunnlag(behandlingsReferanse),
      hentKlageresultat(behandlingsReferanse),
      hentFormkravGrunnlag(behandlingsReferanse),
      hentKlagebehandlingKontorGrunnlag(behandlingsReferanse),
      hentKlagebehandlingNayGrunnlag(behandlingsReferanse),
      hentFullmektigGrunnlag(behandlingsReferanse),
      hentRollerForBruker(),
    ]);
  if (
    isError(brevGrunnlag) ||
    isError(klageresultat) ||
    isError(formkrav) ||
    isError(klagebehandlingKontor) ||
    isError(klagebehandlingNay) ||
    isError(fullmektigGrunnlag)
  ) {
    return (
      <ApiException
        apiResponses={[
          brevGrunnlag,
          klageresultat,
          formkrav,
          klagebehandlingKontor,
          klagebehandlingNay,
          fullmektigGrunnlag,
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
  const readOnlyBrev = aktivtSteg === 'BREV' && !roller.includes(Roller.BESLUTTER);

  if (!brev?.brev) {
    return <BrevOppsummering sendteBrev={sendteBrev} avbrutteBrev={avbrytteBrev} />;
  }

  if (!brev?.brev) {
    return null;
  }

  const behovstype = skrivBrevBehovstype(brev.avklaringsbehovKode);
  const { bruker, fullmektig } = mapGrunnlagTilMottakere(brev.mottaker, fullmektigGrunnlag.data.vurdering);

  return (
    <div className={styles.flex}>
      <KlagesaksopplysningerKolonne
        formkravGrunnlag={formkrav.data}
        klagebehandlingKontorGrunnlag={klagebehandlingKontor.data}
        klagebehandlingNayGrunnlag={klagebehandlingNay.data}
      />
      <SkriveBrev
        status={brev.status}
        referanse={brev.brevbestillingReferanse}
        behovstype={behovstype}
        grunnlag={brev.brev}
        mottaker={brev.mottaker}
        readOnly={readOnlyBrev}
        signaturer={brev.signaturer}
        fullmektigMottaker={fullmektig}
        brukerMottaker={bruker}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
