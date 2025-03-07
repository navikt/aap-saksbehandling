import { logError } from '@navikt/aap-felles-utils';
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

  const førsteBrevgrunnlag = brevGrunnlag.brevGrunnlag[0];

  if (!førsteBrevgrunnlag.brev) {
    logError('Ikke noe brev definert i grunnlaget');
    return null;
  }

  return (
    <div className={styles.flex}>
      <SaksopplysningerKolonne sykdomsgrunnlag={sykdomsgrunnlag} bistandsbehovGrunnlag={bistandsbehovGrunnlag} />
      <SkriveBrev
        referanse={førsteBrevgrunnlag.brevbestillingReferanse}
        grunnlag={førsteBrevgrunnlag.brev}
        mottaker={førsteBrevgrunnlag.mottaker}
        behandlingVersjon={behandlingVersjon}
      />
    </div>
  );
};
