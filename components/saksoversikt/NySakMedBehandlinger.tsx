'use client';

import { Alert, BodyShort, Button, Chips, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { RettighetsinfoDto, SaksInfo, Vurderingsbehov } from 'lib/types/types';
import { SakerResponse } from 'lib/services/apiinternservice/apiInternService';
import { capitalize } from 'lodash';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { useRouter } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';
import { isLocal } from 'lib/utils/environment';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import {
  erAktivFørstegangsbehandling,
  erAvsluttet,
  erAvsluttetFørstegangsbehandling,
  formatterÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/behandling';
import { mapTypeBehandlingTilTekst } from 'lib/utils/oversettelser';
import { useState } from 'react';
import { BehandlingsflytEllerPostmottakBehandling } from './types';
import { usePostmottakBehandlinger } from 'hooks/postmottak/PostmottakBehandlingerHook';
import { useHentOppgaverForBehandlinger } from 'hooks/oppgave/OppgaverPåSakHook';
import { useFeatureFlag } from 'context/UnleashContext';
import { Dato } from 'lib/types/Dato';

const lokalDevToolsForBehandlingOgSak = isLocal();

function formaterVurderingsbehovMedTeller(behov: Vurderingsbehov[]): string {
  const teller = behov.reduce<Record<string, number>>((acc, b) => {
    acc[b] = (acc[b] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(teller)
    .map(([b, antall]) =>
      antall > 1
        ? `${formaterVurderingsbehov(b as Vurderingsbehov)} (${antall})`
        : formaterVurderingsbehov(b as Vurderingsbehov)
    )
    .join(', ');
}

export const NySakMedBehandlinger = ({
  sak,
  innloggetBrukerIdent,
  rettighetsinfo,
  arenaSaker: _arenaSaker,
}: {
  sak: SaksInfo;
  innloggetBrukerIdent: string | undefined;
  rettighetsinfo: RettighetsinfoDto | null;
  arenaSaker: SakerResponse | null;
}) => {
  const router = useRouter();

  const [visMeldekortbehandlinger, setVisMeldekortbehandlinger] = useState(false);
  const [visPostmottakBehandlinger, setVisPostmottakBehandlinger] = useState(false);
  const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
  const visSisteDagMedRett = useFeatureFlag('VisSisteDagMedRett');

  const behandlinger = visMeldekortbehandlinger
    ? sak.behandlinger || []
    : sak.behandlinger.filter((b) => b.årsakTilOpprettelse !== 'MELDEKORT');

  const postmottakBehandlinger: BehandlingsflytEllerPostmottakBehandling[] = usePostmottakBehandlinger(sak.ident);

  const behandlingerMapped: BehandlingsflytEllerPostmottakBehandling[] = behandlinger.map((behandling) => ({
    kilde: 'BEHANDLINGSFLYT',
    behandling: behandling,
  }));

  const alleBehandlinger: BehandlingsflytEllerPostmottakBehandling[] = behandlingerMapped.concat(
    postmottakBehandlinger.filter((b) => !erAvsluttet(b.behandling) || visPostmottakBehandlinger)
  );

  const kanRevurdere = !sak.søknadErTrukket;

  const kanRegistrerebrudd = sak.behandlinger.some((behandling) => erAvsluttetFørstegangsbehandling(behandling));

  const åpne = alleBehandlinger.filter((b) => !erAvsluttet(b.behandling));

  const oppgaverPerBehandling = useHentOppgaverForBehandlinger(åpne.map((b) => b.behandling.referanse));
  const avsluttede = alleBehandlinger?.filter((b) => erAvsluttet(b.behandling));

  function hentTildeling(referanse: string) {
    const oppgaveInfo = oppgaverPerBehandling.get(referanse);
    if (!oppgaveInfo) return null;
    return oppgaveInfo.feilmelding ?? oppgaveInfo.reservertAvNavn ?? oppgaveInfo.reservertAvIdent ?? 'Ledig';
  }

  return (
    <VStack gap="8">
      <HStack justify="start">
        <HStack gap="4">
          <Button
            variant="secondary"
            size="medium"
            onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/klage`)}
          >
            Opprett klage
          </Button>
          {kanRegistrerebrudd && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/aktivitet`)}
            >
              Vurder aktivitetsplikt
            </Button>
          )}

          {kanRevurdere && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/revurdering`)}
            >
              Opprett {erAktivFørstegangsbehandling(sak.behandlinger) ? 'vurdering' : 'revurdering'}
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
        {visSisteDagMedRett && rettighetsinfo?.sisteDagMedRett && (
          <BodyShort>{`Siste dag med rett: ${new Dato(rettighetsinfo.sisteDagMedRett).formaterForFrontend()}`}</BodyShort>
        )}
      </HStack>
      <HStack gap="4">
        <Heading size="small">Behandlinger</Heading>
        {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        <Chips>
          <Chips.Toggle
            selected={visMeldekortbehandlinger}
            onClick={() => setVisMeldekortbehandlinger(!visMeldekortbehandlinger)}
          >
            Meldekortbehandlinger
          </Chips.Toggle>
          <Chips.Toggle
            selected={visPostmottakBehandlinger}
            onClick={() => setVisPostmottakBehandlinger(!visPostmottakBehandlinger)}
          >
            Journalføring og dokumenthåndtering
          </Chips.Toggle>
        </Chips>
      </HStack>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Årsak</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Vurderingsbehov</Table.HeaderCell>
            <Table.HeaderCell>Tildelt</Table.HeaderCell>
            <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {åpne.concat(avsluttede).map((behandling) => (
            <Table.Row key={behandling.behandling.referanse}>
              <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.behandling.opprettet)}</Table.DataCell>
              <Table.DataCell>{mapTypeBehandlingTilTekst(behandling.behandling.typeBehandling)}</Table.DataCell>
              <Table.DataCell>
                {behandling.kilde === 'BEHANDLINGSFLYT'
                  ? formatterÅrsakTilOpprettelseTilTekst(behandling.behandling.årsakTilOpprettelse)
                  : null}
              </Table.DataCell>
              <Table.DataCell>{capitalize(behandling.behandling.status)}</Table.DataCell>
              <Table.DataCell>
                {behandling.kilde === 'BEHANDLINGSFLYT'
                  ? formaterVurderingsbehovMedTeller(behandling.behandling.vurderingsbehov as Vurderingsbehov[])
                  : null}
              </Table.DataCell>
              <Table.DataCell>
                {!erAvsluttet(behandling.behandling) && hentTildeling(behandling.behandling.referanse)}
              </Table.DataCell>
              <Table.DataCell>
                <BehandlingButtons
                  key={behandling.behandling.referanse}
                  sak={sak}
                  behandling={behandling}
                  oppgaveInfo={oppgaverPerBehandling.get(behandling.behandling.referanse)}
                  setFeilmelding={setFeilmelding}
                  innloggetBrukerIdent={innloggetBrukerIdent}
                ></BehandlingButtons>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {lokalDevToolsForBehandlingOgSak && (
        <SakDevTools
          saksnummer={sak.saksnummer}
          behandlinger={sak.behandlinger.map((e) => ({ referanse: e.referanse, type: e.typeBehandling }))}
        />
      )}
    </VStack>
  );
};
