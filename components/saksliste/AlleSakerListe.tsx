'use client';

import { hentAlleSaker } from 'lib/api';
import { SaksInfo } from 'lib/types/types';
import Link from 'next/link';
import useSWR from 'swr';
import { Table } from '@navikt/ds-react';

interface Props {
  alleSaker: SaksInfo[];
}

export const AlleSakerListe = ({ alleSaker }: Props) => {
  const { data } = useSWR('api/sak/alle', hentAlleSaker, { fallbackData: alleSaker });
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Saksnummer</Table.HeaderCell>
          <Table.HeaderCell>Fra</Table.HeaderCell>
          <Table.HeaderCell>Til</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data?.map((sak) => (
          <Table.Row key={sak.saksnummer}>
            <Table.DataCell>
              <Link href={`/sak/${sak.saksnummer}/`}>{sak.saksnummer}</Link>
            </Table.DataCell>
            <Table.DataCell>{sak.periode.fom}</Table.DataCell>
            <Table.DataCell>{sak.periode.tom}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
