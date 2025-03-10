import { SaksopplysningerKolonne } from 'components/behandlinger/brev/skriveBrev/SaksopplysningerKolonne';
import { SkriveBrev } from 'components/behandlinger/brev/skriveBrev/SkriveBrev';
import {
  hentBistandsbehovGrunnlag,
  hentBrevGrunnlag,
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
  const brevGrunnlag = await hentBrevGrunnlag(behandlingsReferanse);
  const sykdomsgrunnlag = await hentSykdomsGrunnlag(behandlingsReferanse);
  const bistandsbehovGrunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse);

  const brev = brevGrunnlag.brevGrunnlag.find((x) => x.status === 'FORHÅNDSVISNING_KLAR');

  if (!brev?.brev) {
    return null;
  }

  return (
    <div className={styles.flex}>
      <SaksopplysningerKolonne sykdomsgrunnlag={sykdomsgrunnlag} bistandsbehovGrunnlag={bistandsbehovGrunnlag} />
      <SkriveBrev
        status={brev.status}
        referanse={brev.brevbestillingReferanse}
        grunnlag={brev.brev}
        mottaker={brev.mottaker}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
