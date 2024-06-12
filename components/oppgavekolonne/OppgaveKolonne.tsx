import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import styles from './OppgaveKolonne.module.css';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
import { TilkjentYtelse } from 'components/behandlinger/tilkjentytelse/TilkjentYtelse';
import { FatteVedtak } from 'components/behandlinger/fattevedtak/FatteVedtak';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import { AlderMedDataFetching } from 'components/behandlinger/alder/AlderMedDataFetching';
interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <div className={styles.kolonne}>
      {aktivGruppe === 'ALDER' && <AlderMedDataFetching behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'LOVVALG' && <div>LOVVALG</div>}
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'KVALITETSSIKRING' && <div>Kvalitetssikring - hva skal vi vise her dah hehe? =)</div>}
      {aktivGruppe === 'MEDLEMSKAP' && <div>MEDLEMSKAP</div>}
      {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'UTTAK' && <div>UTTAK</div>}
      {aktivGruppe === 'BARNETILLEGG' && <div>BARNETILLEGG</div>}
      {aktivGruppe === 'TILKJENT_YTELSE' && <TilkjentYtelse behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SIMULERING' && <div>SIMULERING</div>}
      {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsReferanse={behandlingsReferanse} />}
    </div>
  );
};
