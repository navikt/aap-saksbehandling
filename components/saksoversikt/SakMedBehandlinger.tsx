'use client';

import { Button, Heading, HStack, Page, Table, VStack } from '@navikt/ds-react';
import { isLocal } from 'lib/utils/environment';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { SaksInfo } from 'lib/types/types';
import { capitalize } from 'lodash';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { useRouter } from 'next/navigation';
import { EyeIcon } from '@navikt/aksel-icons';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

const formaterBehandlingType = (behandlingtype: string) => {
  switch (behandlingtype) {
    case 'ae0034':
      return 'Førstegangsbehandling';
    case 'ae0028':
      return 'Revurdering';
    case 'ae0058':
      return 'Klage';
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
      !behandling.årsaker.includes('SØKNAD_TRUKKET')
  ).length;

  const kanRegistrerebrudd = !!sak.behandlinger.filter(
    (behandling) => behandling.type === 'ae0034' && !behandling.årsaker.includes('SØKNAD_TRUKKET')
  ).length;

  return (
    <Page>
      <Page.Block width="xl">
        <VStack gap="8">
          <HStack justify="space-between">
            <Heading size="large">Sak {sak.saksnummer}</Heading>

            <HStack gap="4">
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
              <Button
                variant="secondary"
                size="small"
                onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/klage`)}
              >
                Opprett klage
              </Button>
            </HStack>
          </HStack>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Årsak</Table.HeaderCell>
                <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {sak?.behandlinger?.map((behandling) => {
                const behandlingErÅpen = behandling.status === 'OPPRETTET' || behandling.status === 'UTREDES';
                return (
                  <Table.Row key={behandling.referanse}>
                    <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.opprettet)}</Table.DataCell>
                    <Table.DataCell>{formaterBehandlingType(behandling.type)}</Table.DataCell>
                    <Table.DataCell>{capitalize(behandling.status)}</Table.DataCell>
                    <Table.DataCell>
                      {behandling.årsaker.map((årsak) => formaterÅrsak(årsak)).join(', ')}
                    </Table.DataCell>

                    <Table.DataCell>
                      <HStack gap="2" justify="end">
                        {isLocal() && <BestillBrevTestKnapp behandlingReferanse={behandling.referanse} />}

                        <Button
                          as="a"
                          href={`/saksbehandling/sak/${sak.saksnummer}/${behandling.referanse}`}
                          size="small"
                          icon={!behandlingErÅpen && <EyeIcon />}
                          variant={behandlingErÅpen ? 'primary' : 'secondary'}
                        >
                          {behandlingErÅpen ? 'Åpne' : 'Vis'}
                        </Button>
                      </HStack>
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

          {isLocal() && <SakDevTools saksId={sak.saksnummer} />}
        </VStack>
      </Page.Block>
    </Page>
  );
};
