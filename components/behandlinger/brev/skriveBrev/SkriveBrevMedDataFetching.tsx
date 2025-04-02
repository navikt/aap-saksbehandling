import { SaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKolonne';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import {
  hentBistandsbehovGrunnlag,
  hentBrevGrunnlag,
  hentRefusjonGrunnlag,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from './SkriveBrevMedDataFetching.module.css';
import { hentRollerForBruker, Roller } from 'lib/services/azure/azureUserService';
import { StegType } from 'lib/types/types';

export const SkriveBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  aktivtSteg,
}: {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  aktivtSteg: StegType;
}) => {
  const [brevGrunnlag, sykdomsgrunnlag, bistandsbehovGrunnlag, refusjonGrunnlag, roller] = await Promise.all([
    hentBrevGrunnlag(behandlingsReferanse),
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentRefusjonGrunnlag(behandlingsReferanse),
    hentRollerForBruker(),
  ]);

  const brev = brevGrunnlag.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');
  const readOnlyBrev = aktivtSteg === 'BREV' && !roller.includes(Roller.BESLUTTER);

  if (!brev?.brev) {
    return null;
  }

  return (
    <div className={styles.flex}>
      <SaksopplysningerKolonne
        sykdomsgrunnlag={sykdomsgrunnlag}
        bistandsbehovGrunnlag={bistandsbehovGrunnlag}
        refusjonGrunnlag={refusjonGrunnlag}
      />
      <SkriveBrev
        status={brev.status}
        referanse={brev.brevbestillingReferanse}
        grunnlag={brev.brev}
        mottaker={brev.mottaker}
        readOnly={readOnlyBrev}
        signaturer={brev.signaturer}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
