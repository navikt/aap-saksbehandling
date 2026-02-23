'use client';

import { Button, Chips, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { SaksInfo } from 'lib/types/types';
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
  kanRevurdereSak,
} from 'lib/utils/behandling';
import { mapTypeBehandlingTilTekst } from 'lib/utils/oversettelser';
import { useState } from 'react';
import useSWR from 'swr';
import { postmottakAlleBehandlinger } from 'lib/postmottakClientApi';
import { BeggeBehandling } from './types';

function usePostmottakBehandlinger(ident: string): BeggeBehandling[] {
  const { data: postmottakBehandlinger } = useSWR(
    `alle-behandlinger-${ident}`,
    () => postmottakAlleBehandlinger(ident),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  return postmottakBehandlinger?.type === 'SUCCESS'
    ? postmottakBehandlinger.data.behandlinger.map((behandling) => ({ kilde: 'POSTMOTTAK', behandling: behandling }))
    : [];
}

const lokalDevToolsForBehandlingOgSak = isLocal();
export const SakMedBehandlinger = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const [visMeldekortbehandlinger, setVisMeldekortbehandlinger] = useState(false);
  const [visPostmottakBehandlinger, setVisPostmottakBehandlinger] = useState(true);

  const behandlinger = visMeldekortbehandlinger
    ? sak.behandlinger || []
    : sak.behandlinger.filter((b) => b.årsakTilOpprettelse !== 'MELDEKORT');

  const postmottakBehandlinger: BeggeBehandling[] = usePostmottakBehandlinger(sak.ident);

  const behandlingerMapped: BeggeBehandling[] = behandlinger.map((behandling) => ({
    kilde: 'BEHANDLINGSFLYT',
    behandling: behandling,
  }));

  const alleBehandlinger: BeggeBehandling[] = behandlingerMapped.concat(
    postmottakBehandlinger.filter((b) => !erAvsluttet(b.behandling) || visPostmottakBehandlinger)
  );

  const kanRevurdere = kanRevurdereSak(behandlinger);

  const kanRegistrerebrudd = sak.behandlinger.some((behandling) => erAvsluttetFørstegangsbehandling(behandling));

  const åpne = alleBehandlinger.filter((b) => !erAvsluttet(b.behandling));
  const avsluttede = alleBehandlinger?.filter((b) => erAvsluttet(b.behandling));

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
      </HStack>
      <VStack gap="4">
        <Heading size="xsmall">Behandlinger</Heading>
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
      </VStack>
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
                  ? behandling.behandling.vurderingsbehov.map((behov) => formaterVurderingsbehov(behov)).join(', ')
                  : null}
              </Table.DataCell>

              <Table.DataCell>
                <BehandlingButtons
                  key={behandling.behandling.referanse}
                  sak={sak}
                  behandling={behandling}
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
