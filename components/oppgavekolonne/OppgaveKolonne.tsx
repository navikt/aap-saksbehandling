import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import styles from './OppgaveKolonne.module.css';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
import { TilkjentYtelse } from 'components/behandlinger/tilkjentytelse/TilkjentYtelse';
import { FatteVedtak } from 'components/behandlinger/fattevedtak/FatteVedtak';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import { AlderMedDataFetching } from 'components/behandlinger/alder/AlderMedDataFetching';
import { Student } from 'components/behandlinger/sykdom/student/Student';
import { Barnetillegg } from 'components/behandlinger/barnetillegg/Barnetillegg';
import { EtAnnetSted } from 'components/behandlinger/etannetsted/EtAnnetSted';
import { MedlemskapMedDataFetching } from 'components/behandlinger/medlemskap/MedlemskapMedDataFetching';

interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <div className={styles.kolonne}>
      {aktivGruppe === 'LOVVALG' && <div>LOVVALG</div>}
      {aktivGruppe === 'ALDER' && <AlderMedDataFetching behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'STUDENT' && <Student behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'MEDLEMSKAP' && <MedlemskapMedDataFetching behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'UNDERVEIS' && <div>UNDERVEIS</div>}
      {aktivGruppe === 'ET_ANNET_STED' && <EtAnnetSted behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'BARNETILLEGG' && <Barnetillegg behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'TILKJENT_YTELSE' && <TilkjentYtelse behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SIMULERING' && <div>SIMULERING</div>}
      {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'IVERKSETT_VEDTAK' && <div>Behandling avsluttet</div>}
    </div>
  );
};
