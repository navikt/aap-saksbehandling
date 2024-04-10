import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import styles from './OppgaveKolonne.module.css';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
import { FatteVedtak } from 'components/behandlinger/fattevedtak/FatteVedtak';
interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <div className={styles.kolonne}>
      {aktivGruppe === 'ALDER' && <div>ALDER</div>}
      {aktivGruppe === 'LOVVALG' && <div>LOVVALG</div>}
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'MEDLEMSKAP' && <div>MEDLEMSKAP</div>}
      {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'UTTAK' && <div>UTTAK</div>}
      {aktivGruppe === 'BARNETILLEGG' && <div>BARNETILLEGG</div>}
      {aktivGruppe === 'TILKJENT_YTELSE' && <div>TILKJENT YTELSE</div>}
      {aktivGruppe === 'SIMULERING' && <div>SIMULERING</div>}
      {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsReferanse={behandlingsReferanse} />}
    </div>
  );
};
