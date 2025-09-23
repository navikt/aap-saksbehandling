'use client';

import { Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { SaksInfo, Vurderingsbehov, ÅrsakTilOpprettelse } from 'lib/types/types';
import { capitalize } from 'lodash';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { useRouter } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';
import { isLocal, isProd } from 'lib/utils/environment';

const formaterBehandlingType = (behandlingtype: string) => {
  switch (behandlingtype) {
    case 'ae0034':
      return 'Førstegangsbehandling';
    case 'ae0028':
      return 'Revurdering';
    case 'ae0058':
      return 'Klage';
    case 'svar-fra-andreinstans':
      return 'Svar fra Nav Klageinstans';
    case 'oppfølgingsbehandling':
      return 'Oppfølgingsoppgave';
    case 'aktivitetsplikt':
      return 'Aktivitetsplikt $ 11-7';
    case 'aktivitetsplikt11-9':
      return 'Aktivitetsplikt $ 11-9';
    default:
      return `Ukjent behandlingtype (${behandlingtype})`;
  }
};

const formaterVurderingsbehov = (vurderingsbehov: Vurderingsbehov): string => {
  switch (vurderingsbehov) {
    case 'MOTTATT_SØKNAD':
      return 'Søknad';
    case 'MOTTATT_AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'MOTTATT_MELDEKORT':
      return 'Meldekort';
    case 'MOTTATT_LEGEERKLÆRING':
      return 'Legeerklæring';
    case 'MOTTATT_AVVIST_LEGEERKLÆRING':
      return 'Avvist legeerklæring';
    case 'MOTTATT_DIALOGMELDING':
      return 'Dialogmelding';
    case 'G_REGULERING':
      return 'G-regulering';
    case 'REVURDER_MEDLEMSKAP':
      return 'Revurder medlemskap';
    case 'REVURDER_YRKESSKADE':
      return 'Revurder yrkesskade';
    case 'REVURDER_BEREGNING':
      return 'Revurder beregning';
    case 'REVURDER_LOVVALG':
      return 'Revurder lovvalg';
    case 'REVURDER_SAMORDNING':
      return 'Revurder samordning';
    case 'MOTATT_KLAGE':
      return 'Klage';
    case 'LOVVALG_OG_MEDLEMSKAP':
      return 'Lovvalg og medlemskap';
    case 'FORUTGAENDE_MEDLEMSKAP':
      return 'Forutgående medlemskap';
    case 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND':
      return 'Sykdom arbeidsevne behov for bistand';
    case 'BARNETILLEGG':
      return 'Barnetillegg';
    case 'INSTITUSJONSOPPHOLD':
      return 'Institusjonsopphold';
    case 'SAMORDNING_OG_AVREGNING':
      return 'Samordning og avregning';
    case 'REFUSJONSKRAV':
      return 'Refusjonskrav';
    case 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT':
      return 'Utenlandsopphold for soknadstidspunkt';
    case 'SØKNAD_TRUKKET':
      return 'Trukket søknad';
    case 'VURDER_RETTIGHETSPERIODE':
      return 'Starttidspunkt';
    case 'KLAGE_TRUKKET':
      return 'Klage trukket';
    case 'REVURDERING_AVBRUTT':
      return 'Revurdering avbrutt';
    case 'MOTTATT_KABAL_HENDELSE':
      return 'Mottatt svar fra Nav Klageinstans';
    case 'FRITAK_MELDEPLIKT':
      return 'Fritak meldeplikt';
    case 'REVURDER_MANUELL_INNTEKT':
      return 'Revurder manuell inntekt';
    case 'OPPFØLGINGSOPPGAVE':
      return 'Vurder konsekvens';
    case 'HELHETLIG_VURDERING':
      return 'Helhetlig vurdering';
    case 'REVURDER_MELDEPLIKT_RIMELIG_GRUNN':
      return 'Revurder meldeplikt rimelig grunn';
    case 'AKTIVITETSPLIKT_11_7':
      return 'Aktivitetsplikt $ 11-7';
    case 'AKTIVITETSPLIKT_11_9':
      return 'Aktivitetsplikt $ 11-9';
    case 'EFFEKTUER_AKTIVITETSPLIKT':
      return 'Effektuer aktivitetsplikt';
    case 'OVERGANG_UFORE':
      return 'Overgang til uføre';
    case 'OVERGANG_ARBEID':
      return 'Overgang arbeidssøker';
    default:
      return vurderingsbehov;
  }
};

const formatterÅrsakTilOpprettelseTilTekst = (årsakTilOpprettelse: ÅrsakTilOpprettelse): string => {
  switch (årsakTilOpprettelse) {
    case 'SØKNAD':
      return 'Søknad';
    case 'MANUELL_OPPRETTELSE':
      return 'Manuell opprettelse';
    case 'HELSEOPPLYSNINGER':
      return 'Helseopplysninger';
    case 'ANNET_RELEVANT_DOKUMENT':
      return 'Annet relevant dokument';
    case 'OMGJØRING_ETTER_KLAGE':
      return 'Omgjøring etter klage';
    case 'OMGJØRING_ETTER_SVAR_FRA_KLAGEINSTANS':
      return 'Omgjøring etter svar fra klageinstans';
    case 'FASTSATT_PERIODE_PASSERT':
      return 'Fastsatt periode passert';
    case 'FRITAK_MELDEPLIKT':
      return 'Fritak meldeplikt';
    case 'MELDEKORT':
      return 'Meldekort';
    case 'AKTIVITETSMELDING':
      return 'Aktivitetsmelding';
    case 'OPPFØLGINGSOPPGAVE':
      return 'Manuelt opprettet';
    case 'OPPFØLGINGSOPPGAVE_SAMORDNING_GRADERING':
      return 'Maksdato annen full ytelse';
    case 'SVAR_FRA_KLAGEINSTANS':
      return 'Svar fra klageinstans';
    case 'KLAGE':
      return 'Klage';
    case 'ENDRING_I_REGISTERDATA':
      return 'Endring i register';
    case 'AKTIVITETSPLIKT':
      return 'Aktivitetsplikt';
    default:
      return 'Ukjent årsak';
  }
};

export const SakMedBehandlinger = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const kanRevurdere = !!sak.behandlinger.filter(
    (behandling) =>
      behandling.type === 'ae0034' &&
      behandling.status !== 'OPPRETTET' &&
      !behandling.vurderingsbehov.includes('SØKNAD_TRUKKET')
  ).length;

  const kanRegistrerebrudd =
    sak.behandlinger.filter(
      (behandling) => behandling.type === 'ae0034' && !behandling.vurderingsbehov.includes('SØKNAD_TRUKKET')
    ).length > 0;

  return (
    <VStack gap="8">
      <HStack justify="space-between">
        <Heading size="large">Sak {sak.saksnummer}</Heading>

        <HStack gap="4">
          <Button
            variant="secondary"
            size="small"
            onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/klage`)}
          >
            Opprett klage
          </Button>
          {kanRegistrerebrudd && !isProd() && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/aktivitet`)}
            >
              Registrer brudd på aktivitetsplikten
            </Button>
          )}

          {kanRevurdere && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/revurdering`)}
            >
              Opprett revurdering
            </Button>
          )}

          {kanRevurdere && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/oppfolging`)}
            >
              Opprett oppfølgingsoppgave
            </Button>
          )}
        </HStack>
      </HStack>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
            <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sak?.behandlinger?.map((behandling) => (
            <Table.Row key={behandling.referanse}>
              <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.opprettet)}</Table.DataCell>
              <Table.DataCell>{formaterBehandlingType(behandling.type)}</Table.DataCell>
              <Table.DataCell>{formatterÅrsakTilOpprettelseTilTekst(behandling.årsakTilOpprettelse)}</Table.DataCell>
              <Table.DataCell>{capitalize(behandling.status)}</Table.DataCell>
              <Table.DataCell>
                {behandling.vurderingsbehov.map((behov) => formaterVurderingsbehov(behov)).join(', ')}
              </Table.DataCell>

              <Table.DataCell>
                <BehandlingButtons
                  key={behandling.referanse}
                  sak={sak}
                  behandlingsReferanse={behandling.referanse}
                  behandlingsstatus={behandling.status}
                ></BehandlingButtons>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {isLocal() && (
        <SakDevTools
          saksnummer={sak.saksnummer}
          behandlinger={sak.behandlinger.map((e) => ({ referanse: e.referanse, type: e.type }))}
        />
      )}
    </VStack>
  );
};
