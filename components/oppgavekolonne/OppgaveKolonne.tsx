import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { StegGruppe } from 'lib/types/types';
import { Grunnlag } from 'components/behandlinger/grunnlag/Grunnlag';
import { TilkjentYtelse } from 'components/behandlinger/tilkjentytelse/TilkjentYtelse';
import { FatteVedtak } from 'components/behandlinger/fattevedtak/FatteVedtak';
import { Vedtak } from 'components/behandlinger/vedtak/Vedtak';
import { AlderMedDataFetching } from 'components/behandlinger/alder/AlderMedDataFetching';
import { Student } from 'components/behandlinger/sykdom/student/Student';
import { Barnetillegg } from 'components/behandlinger/barnetillegg/Barnetillegg';
import { Institusjonsopphold } from 'components/behandlinger/institusjonsopphold/Institusjonsopphold';
import { Brev } from 'components/behandlinger/brev/Brev';
import { Underveis } from 'components/behandlinger/underveis/Underveis';
import { Samordning } from 'components/behandlinger/samordning/Samordning';
import { Rettighetsperiode } from '../behandlinger/rettighetsperiode/Rettighetsperiode';
import { Søknad } from 'components/behandlinger/søknad/Søknad';
import { Formkrav } from '../behandlinger/klage/formkrav/Formkrav';
import { Simulering } from 'components/behandlinger/simulering/Simulering';
import { TrekkKlage } from 'components/behandlinger/klage/trekkklage/TrekkKlage';
import { KlagebehandlingKontor } from '../behandlinger/klage/klagebehandlingkontor/KlagebehandlingKontor';
import { KlagebehandlingNay } from '../behandlinger/klage/klagebehandlingnay/KlagebehandlingNay';
import { Omgjøring } from 'components/behandlinger/klage/omgjøring/Omgjøring';
import { Opprettholdelse } from 'components/behandlinger/klage/opprettholdelse/Opprettholdelse';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SvarFraAndreinstansGruppe } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstansGruppe';
import { StartBehandling } from '../behandlinger/startbehandling/StartBehandling';
import { KabalIverksettKonsekvensSteg } from 'components/behandlinger/klage/kabaliverksettkonsekvens/KabalIverksettKonsekvensMedDataFetching';
import { AvklarOppfolgingsSteg } from 'components/behandlinger/oppfolgingsbehandling/AvklarOppfolgingsSteg';
import { Aktivitetsplikt11_7 } from 'components/behandlinger/aktivitetsplikt/11-7/Aktivitetsplikt11_7';
import { AvbrytRevurdering } from 'components/behandlinger/revurdering/avbrytVurdering/AvbrytRevurdering';
import { OppholdskravStegGruppe } from 'components/behandlinger/oppholdskrav/OppholdskravGruppe';
import { Aktivitetsplikt11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Aktivitetsplikt11_9';
import { LovvalgPeriodisert } from 'components/behandlinger/lovvalg/LovvalgPeriodisert';
import { PeriodisertForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/PeriodisertForutgåendeMedlemskap';
import { Vedtakslengde } from 'components/behandlinger/vedtakslengde/Vedtakslengde';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  aktivGruppe: StegGruppe;
  className: string;
}

export const OppgaveKolonne = async ({ behandlingsreferanse, aktivGruppe, className }: Props) => (
  <section className={className}>
    {aktivGruppe === 'START_BEHANDLING' && <StartBehandling behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'SØKNAD' && <Søknad behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'AVBRYT_REVURDERING' && <AvbrytRevurdering behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'LOVVALG' && (
      <StegSuspense>
        <LovvalgPeriodisert behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
    )}
    {aktivGruppe === 'RETTIGHETSPERIODE' && <Rettighetsperiode behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'ALDER' && (
      <StegSuspense>
        <AlderMedDataFetching behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
    )}
    {aktivGruppe === 'STUDENT' && <Student behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'MEDLEMSKAP' && (
      <StegSuspense>
        <PeriodisertForutgåendeMedlemskap behandlingsreferanse={behandlingsreferanse} />
      </StegSuspense>
    )}
    {aktivGruppe === 'OPPHOLDSKRAV' && <OppholdskravStegGruppe behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsreferanse={behandlingsreferanse} />}
    {unleashService.isEnabled('VedtakslengdeAvklaringsbehov') && aktivGruppe === 'VEDTAKSLENGDE' && (
      <Vedtakslengde behandlingsreferanse={behandlingsreferanse} />
    )}
    {aktivGruppe === 'UNDERVEIS' && <Underveis behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'SAMORDNING' && <Samordning behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'ET_ANNET_STED' && <Institusjonsopphold behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'BARNETILLEGG' && <Barnetillegg behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'TILKJENT_YTELSE' && <TilkjentYtelse behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'SIMULERING' && <Simulering behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'IVERKSETT_VEDTAK' && <div>Behandling avsluttet</div>}
    {aktivGruppe === 'BREV' && <Brev behandlingsreferanse={behandlingsreferanse} />}
    {/* Klage */}
    {aktivGruppe === 'FORMKRAV' && <Formkrav behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'KLAGEBEHANDLING_KONTOR' && <KlagebehandlingKontor behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'KLAGEBEHANDLING_NAY' && <KlagebehandlingNay behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'OMGJØRING' && <Omgjøring behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'OPPRETTHOLDELSE' && <Opprettholdelse behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'TREKK_KLAGE' && <TrekkKlage behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'SVAR_FRA_ANDREINSTANS' && (
      <SvarFraAndreinstansGruppe behandlingsreferanse={behandlingsreferanse} />
    )}
    {aktivGruppe === 'IVERKSETT_KONSEKVENS' && (
      <KabalIverksettKonsekvensSteg behandlingsreferanse={behandlingsreferanse} />
    )}
    {/* Oppfølgingsbehandling */}
    {(aktivGruppe === 'START_OPPFØLGINGSBEHANDLING' || aktivGruppe === 'AVKLAR_OPPPFØLGING') && (
      <AvklarOppfolgingsSteg behandlingsreferanse={behandlingsreferanse} />
    )}
    {/* Aktivitetsplikt */}
    {aktivGruppe === 'AKTIVITETSPLIKT_11_7' && <Aktivitetsplikt11_7 behandlingsreferanse={behandlingsreferanse} />}
    {aktivGruppe === 'AKTIVITETSPLIKT_11_9' && <Aktivitetsplikt11_9 behandlingsreferanse={behandlingsreferanse} />}
  </section>
);
