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
  erFørstegangsbehandling,
  erTrukket,
  formatterÅrsakTilOpprettelseTilTekst,
} from 'lib/utils/behandling';
import { mapTypeBehandlingTilTekst } from 'lib/utils/oversettelser';
import { useState } from 'react';

const lokalDevToolsForBehandlingOgSak = isLocal();
export const SakMedBehandlinger = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const [visMeldekortbehandlinger, setVisMeldekortbehandlinger] = useState(false);

  const alleBehandlinger = visMeldekortbehandlinger
    ? sak.behandlinger || []
    : sak.behandlinger.filter((b) => b.årsakTilOpprettelse != 'MELDEKORT');

  const kanRevurdere = alleBehandlinger.some(
    (behandling) => erFørstegangsbehandling(behandling) && behandling.status !== 'OPPRETTET' && !erTrukket(behandling)
  );

  const kanRegistrerebrudd = alleBehandlinger.some((behandling) => erAvsluttetFørstegangsbehandling(behandling));

  const åpne = alleBehandlinger.filter((b) => !erAvsluttet(b));
  const avsluttede = alleBehandlinger?.filter((b) => erAvsluttet(b));

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

      <Chips>
        <Chips.Toggle
          selected={visMeldekortbehandlinger}
          onClick={() => setVisMeldekortbehandlinger(!visMeldekortbehandlinger)}
        >
          Vis meldekortbehandlinger
        </Chips.Toggle>
      </Chips>
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
            <Table.Row key={behandling.referanse}>
              <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.opprettet)}</Table.DataCell>
              <Table.DataCell>{mapTypeBehandlingTilTekst(behandling.typeBehandling)}</Table.DataCell>
              <Table.DataCell>{formatterÅrsakTilOpprettelseTilTekst(behandling.årsakTilOpprettelse)}</Table.DataCell>
              <Table.DataCell>{capitalize(behandling.status)}</Table.DataCell>
              <Table.DataCell>
                {behandling.vurderingsbehov.map((behov) => formaterVurderingsbehov(behov)).join(', ')}
              </Table.DataCell>

              <Table.DataCell>
                <BehandlingButtons key={behandling.referanse} sak={sak} behandling={behandling}></BehandlingButtons>
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
