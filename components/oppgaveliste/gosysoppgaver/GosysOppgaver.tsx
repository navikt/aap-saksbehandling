'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Pagination, Table } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { clientHentGosysOppgaver } from 'lib/clientApi';
import { isError } from 'lib/utils/api';
import { TableStyled } from 'components/tablestyled/TableStyled';

const OPPGAVER_PER_SIDE = 10;

export const GosysOppgaver = () => {
  const [side, setSide] = useState(1);
  const { data, isLoading, error } = useSWR(
    ['/oppgave/api/gosys', side] as const,
    ([, side]) =>
      clientHentGosysOppgaver({
        tema: ['AAP'],
        behandlingstype: 'ae0292',
        statuskategori: 'AAPEN',
        limit: OPPGAVER_PER_SIDE,
        offset: (side - 1) * OPPGAVER_PER_SIDE,
      }),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return <Spinner label="Henter Gosys-oppgaver" />;
  }

  if (error || isError(data)) {
    return <Alert variant="error">Kunne ikke hente Gosys-oppgaver. {error}</Alert>;
  }

  const antallTreff = data?.data.antallTreffTotalt ?? 0;
  const antallSider = Math.ceil(antallTreff / OPPGAVER_PER_SIDE);
  const oppgaver = data?.data.oppgaver ?? [];

  console.log(oppgaver)

  return (
    <>
      <div>
        Viser {oppgaver.length} av {antallTreff} Gosys-oppgaver.
      </div>
      <TableStyled size="small" zebraStripes aria-label="Gosys-oppgaver">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Oppgave-ID</Table.HeaderCell>
            <Table.HeaderCell>Oppgavetype</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Enhet</Table.HeaderCell>
            <Table.HeaderCell>Tildelt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {oppgaver.length === 0 ? (
            <Table.Row>
              <Table.DataCell colSpan={5}>Ingen Gosys-oppgaver funnet.</Table.DataCell>
            </Table.Row>
          ) : (
            oppgaver.map((oppgave) => (
              <Table.Row key={oppgave.id}>
                <Table.DataCell>{oppgave.id}</Table.DataCell>
                <Table.DataCell>{oppgave.oppgavetype}</Table.DataCell>
                <Table.DataCell>{oppgave.status}</Table.DataCell>
                <Table.DataCell>{oppgave.tildeltEnhetsnr}</Table.DataCell>
                <Table.DataCell>{oppgave.tilordnetRessurs ?? 'Ikke tildelt'}</Table.DataCell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </TableStyled>
      {antallSider > 1 && (
        <Pagination
          page={side}
          onPageChange={setSide}
          count={antallSider}
          size="small"
          srHeading={{ tag: 'h2', text: 'Gosys-oppgaver, sidevalg' }}
        />
      )}
    </>
  );
};
