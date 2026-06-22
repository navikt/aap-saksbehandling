import { Sykdom } from 'components/behandlinger/sykdom/Sykdom';
import { BehandlingFlytOgTilstand, StegGruppe } from 'lib/types/types';
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
import { AvbrytAktivitetspliktbehandling } from 'components/behandlinger/aktivitetsplikt/avbryt/vurdering/AvbrytAktivitetspliktbehandling';
import { AvslagForAndreYtelser } from 'components/behandlinger/samordning/avslag11_27/AvslagForAndreYtelser';

interface Props {
  behandlingsreferanse: string;
  aktivGruppe: StegGruppe;
  className: string;
  flyt: BehandlingFlytOgTilstand;
}

export const OppgaveKolonne = async ({ behandlingsreferanse, aktivGruppe, className, flyt }: Props) => (
  <section className={className}>
    {aktivGruppe === 'START_BEHANDLING' && <StartBehandling behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'SØKNAD' && <Søknad behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'AVBRYT_REVURDERING' && (
      <AvbrytRevurdering behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'LOVVALG' && (
      <StegSuspense>
        <LovvalgPeriodisert behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
      </StegSuspense>
    )}
    {aktivGruppe === 'RETTIGHETSPERIODE' && (
      <Rettighetsperiode behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'ALDER' && (
      <StegSuspense>
        <AlderMedDataFetching behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
      </StegSuspense>
    )}
    {aktivGruppe === 'AVSLAG_11_27' && (
      <AvslagForAndreYtelser behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'STUDENT' && <Student behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'SYKDOM' && <Sykdom behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'MEDLEMSKAP' && (
      <StegSuspense>
        <PeriodisertForutgåendeMedlemskap behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
      </StegSuspense>
    )}
    {aktivGruppe === 'OPPHOLDSKRAV' && (
      <OppholdskravStegGruppe behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'GRUNNLAG' && <Grunnlag behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'VEDTAKSLENGDE' && <Vedtakslengde behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'UNDERVEIS' && <Underveis behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'SAMORDNING' && <Samordning behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'ET_ANNET_STED' && <Institusjonsopphold behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'BARNETILLEGG' && <Barnetillegg behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'TILKJENT_YTELSE' && <TilkjentYtelse behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'SIMULERING' && <Simulering behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'VEDTAK' && <Vedtak behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'FATTE_VEDTAK' && <FatteVedtak behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'IVERKSETT_VEDTAK' && <div>Behandling avsluttet</div>}
    {aktivGruppe === 'BREV' && <Brev behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {/* Klage */}
    {aktivGruppe === 'FORMKRAV' && <Formkrav behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'KLAGEBEHANDLING_KONTOR' && (
      <KlagebehandlingKontor behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'KLAGEBEHANDLING_NAY' && (
      <KlagebehandlingNay behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'OMGJØRING' && <Omgjøring behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'OPPRETTHOLDELSE' && <Opprettholdelse behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'TREKK_KLAGE' && <TrekkKlage behandlingsreferanse={behandlingsreferanse} flyt={flyt} />}
    {aktivGruppe === 'SVAR_FRA_ANDREINSTANS' && (
      <SvarFraAndreinstansGruppe behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'IVERKSETT_KONSEKVENS' && (
      <KabalIverksettKonsekvensSteg behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {/* Oppfølgingsbehandling */}
    {(aktivGruppe === 'START_OPPFØLGINGSBEHANDLING' || aktivGruppe === 'AVKLAR_OPPPFØLGING') && (
      <AvklarOppfolgingsSteg behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {/* Aktivitetsplikt */}
    {aktivGruppe === 'AKTIVITETSPLIKT_11_7' && (
      <Aktivitetsplikt11_7 behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'AKTIVITETSPLIKT_11_9' && (
      <Aktivitetsplikt11_9 behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
    {aktivGruppe === 'AVBRYT_AKTIVITETSPLIKTBEHANDLING' && (
      <AvbrytAktivitetspliktbehandling behandlingsreferanse={behandlingsreferanse} flyt={flyt} />
    )}
  </section>
);
