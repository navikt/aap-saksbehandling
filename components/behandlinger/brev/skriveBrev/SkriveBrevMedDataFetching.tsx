import { SaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKolonne';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import {
  hentBistandsbehovGrunnlag,
  hentBrevGrunnlag,
  hentRefusjonGrunnlag,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import styles from './SkriveBrevMedDataFetching.module.css';

export const SkriveBrevMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
}: {
  behandlingsReferanse: string;
  behandlingVersjon: number;
}) => {
  const [brevGrunnlag, sykdomsgrunnlag, bistandsbehovGrunnlag, refusjonGrunnlag] = await Promise.all([
    hentBrevGrunnlag(behandlingsReferanse),
    hentSykdomsGrunnlag(behandlingsReferanse),
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentRefusjonGrunnlag(behandlingsReferanse),
  ]);

  const brev = brevGrunnlag.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');

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
        signaturer={brev.signaturer}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
