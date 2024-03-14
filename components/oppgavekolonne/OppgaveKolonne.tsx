import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import styles from './OppgaveKolonne.module.css';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <div className={styles.kolonne}>
      {aktivGruppe === 'ALDER' && <div>ALDER</div>}
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsReferanse={behandlingsReferanse} />}
    </div>
  );
};
