'use client';

import { hentAlleSaker } from 'lib/clientApi';
import { SaksInfo } from 'lib/types/types';
import Link from 'next/link';
import useSWR from 'swr';
import { Table, TextField } from '@navikt/ds-react';
import { formaterDatoForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  alleSaker: SaksInfo[];
}

export const AlleSakerListe = ({ alleSaker }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { data } = useSWR('api/sak/alle', hentAlleSaker, { fallbackData: alleSaker });

  const searchValue = searchParams.get('ident');

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TextField
          label={'Ident'}
          size={'small'}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams);
            if (event.target.value) {
              params.set('ident', event.target.value);
            } else {
              params.delete('ident');
            }
            replace(`${pathname}?${params.toString()}`);
          }}
        />
      </div>
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
            ?.filter((sak) => !searchValue || sak.ident.includes(searchValue))
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
    </div>
  );
};
