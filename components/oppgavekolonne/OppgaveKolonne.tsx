import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
import { TilkjentYtelse } from 'components/behandlinger/tilkjentytelse/TilkjentYtelse';
import { FatteVedtak } from 'components/behandlinger/fattevedtak/FatteVedtak';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import { AlderMedDataFetching } from 'components/behandlinger/alder/AlderMedDataFetching';
import { Student } from 'components/behandlinger/sykdom/student/Student';
import { Barnetillegg } from 'components/behandlinger/barnetillegg/Barnetillegg';
import { EtAnnetSted } from 'components/behandlinger/etannetsted/EtAnnetSted';
import { Brev } from 'components/behandlinger/brev/Brev';
import { Underveis } from 'components/behandlinger/underveis/Underveis';
import { Lovvalg } from 'components/behandlinger/lovvalg/Lovvalg';
import { ForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendeMedlemskap';
import { Samordning } from 'components/behandlinger/samordning/Samordning';
import { Søknad } from 'components/behandlinger/søknad/Søknad';

interface Props {
  behandlingsReferanse: string;
  aktivGruppe: StegGruppe;
}

export const OppgaveKolonne = async ({ behandlingsReferanse, aktivGruppe }: Props) => {
  return (
    <>
      {aktivGruppe === 'SØKNAD' && <Søknad behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'LOVVALG' && <Lovvalg behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'ALDER' && <AlderMedDataFetching behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'STUDENT' && <Student behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'MEDLEMSKAP' && <ForutgåendeMedlemskap behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'UNDERVEIS' && <Underveis behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SAMORDNING' && <Samordning behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'ET_ANNET_STED' && <EtAnnetSted behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'BARNETILLEGG' && <Barnetillegg behandlingsreferanse={behandlingsReferanse} />}
      {aktivGruppe === 'TILKJENT_YTELSE' && <TilkjentYtelse behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'SIMULERING' && <div>SIMULERING</div>}
      {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsReferanse={behandlingsReferanse} />}
      {aktivGruppe === 'IVERKSETT_VEDTAK' && <div>Behandling avsluttet</div>}
      {aktivGruppe === 'BREV' && <Brev behandlingsReferanse={behandlingsReferanse} />}
    </>
  );
};
