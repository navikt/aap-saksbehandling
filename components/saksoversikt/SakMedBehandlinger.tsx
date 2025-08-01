'use client';

import { Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { isLocal, isProd } from 'lib/utils/environment';
import { SaksInfo } from 'lib/types/types';
import { capitalize } from 'lodash';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { useRouter } from 'next/navigation';
import { formaterVurderingsbehov } from 'lib/utils/vurderingsbehov';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';

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
    default:
      return `Ukjent behandlingtype (${behandlingtype})`;
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

  const kanRegistrerebrudd = !!sak.behandlinger.filter(
    (behandling) => behandling.type === 'ae0034' && !behandling.vurderingsbehov.includes('SØKNAD_TRUKKET')
  ).length;

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
