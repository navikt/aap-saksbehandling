'use client';

import { Button, Heading, Page, Table, Tag } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { useRouter } from 'next/navigation';
import { EyeIcon } from '@navikt/aksel-icons';
import { capitalize } from 'lodash';

interface Props {
  behandlinger?: { id: string; journalpostId: string; status: string; opprettet: string; steg: string }[];
}

export const BehandlingOversikt = ({ behandlinger }: Props) => {
  const router = useRouter();

  return (
    <Page.Block width="xl">
      <Heading size="large">Postmottak</Heading>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>JournalpostID</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Steg</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {behandlinger?.map((behandling) => (
            <Table.Row key={behandling.id}>
              <Table.DataCell>{behandling.id}</Table.DataCell>
              <Table.DataCell>{behandling.journalpostId}</Table.DataCell>
              <Table.DataCell>{formaterDatoMedTidspunktForFrontend(behandling.opprettet)}</Table.DataCell>
              <Table.DataCell>{capitalize(behandling.steg?.replace(/_/g, ' '))}</Table.DataCell>
              <Table.DataCell>
                <Tag variant={behandling.status === 'AVSLUTTET' ? 'success' : 'info'}>
                  {capitalize(behandling.status)}
                </Tag>
              </Table.DataCell>
              <Table.DataCell>
                {behandling.status === 'AVSLUTTET' ? (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => router.push(`/postmottak/${behandling.id}/`)}
                    icon={<EyeIcon />}
                  >
                    Vis
                  </Button>
                ) : (
                  <Button size="small" onClick={() => router.push(`/postmottak/${behandling.id}/`)}>
                    Behandle
                  </Button>
                )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Page.Block>
  );
};
