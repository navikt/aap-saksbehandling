'use client';

import { Button, Heading, HStack, Page, Table, VStack } from '@navikt/ds-react';
import { isLocal, isProduction } from 'lib/utils/environment';
import { formaterDatoTidForVisning } from '@navikt/aap-felles-utils-client';
import { BestillBrevTestKnapp } from 'components/behandlinger/brev/BestillBrevTestKnapp';
import { SaksInfo } from 'lib/types/types';
import { capitalize } from 'lodash';
import { SakDevTools } from 'components/saksoversikt/SakDevTools';
import { useRouter } from 'next/navigation';
import { EyeIcon } from '@navikt/aksel-icons';

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

  return (
    <Page>
      <Page.Block width="xl">
        <VStack gap="8">
          <HStack justify="space-between">
            <Heading size="large">Sak {sak.saksnummer}</Heading>

            {!isProduction() && (
              <Button
                variant="secondary"
                onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}/aktivitet`)}
              >
                Registrer brudd på aktivitetsplikten
              </Button>
            )}
          </HStack>

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell align="right">Handlinger</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {sak?.behandlinger?.map((behandling) => {
                const behandlingErÅpen = behandling.status === 'OPPRETTET' || behandling.status === 'UTREDES';
                return (
                  <Table.Row key={behandling.referanse}>
                    <Table.DataCell>{formaterDatoTidForVisning(behandling.opprettet)}</Table.DataCell>
                    <Table.DataCell>{formaterBehandlingType(behandling.type)}</Table.DataCell>
                    <Table.DataCell>{capitalize(behandling.status)}</Table.DataCell>

                    <Table.DataCell>
                      <HStack gap="2" justify="end">
                        {isLocal() && <BestillBrevTestKnapp behandlingReferanse={behandling.referanse} />}

                        <Button
                          as="a"
                          href={`/saksbehandling/sak/${sak.saksnummer}/${behandling.referanse}`}
                          size="small"
                          icon={!behandlingErÅpen && <EyeIcon />}
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
