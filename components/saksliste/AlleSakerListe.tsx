'use client';

import { hentAlleSaker, rekjørFeiledeOppgaver } from 'lib/clientApi';
import { SaksInfo } from 'lib/types/types';
import Link from 'next/link';
import useSWR from 'swr';
import { Button, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';

interface Props {
  alleSaker: SaksInfo[];
}

export const AlleSakerListe = ({ alleSaker }: Props) => {
  const { data } = useSWR('api/sak/alle', hentAlleSaker, { fallbackData: alleSaker });

  return (
    <>
      <Button onClick={async () => await rekjørFeiledeOppgaver()}>Rekjør feilede oppgaver</Button>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell>Ident</Table.HeaderCell>
            <Table.HeaderCell>Fra</Table.HeaderCell>
            <Table.HeaderCell>Til</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data
            ?.sort((a, b) => sorterEtterNyesteDato(a.periode.fom, b.periode.fom))
            .map((sak) => (
              <Table.Row key={sak.saksnummer}>
                <Table.DataCell>
                  <Link href={`/sak/${sak.saksnummer}/`}>{sak.saksnummer}</Link>
                </Table.DataCell>
                <Table.DataCell>{sak.ident}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(sak.periode.fom)}</Table.DataCell>
                <Table.DataCell>{formaterDatoForFrontend(sak.periode.tom)}</Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  );
};
