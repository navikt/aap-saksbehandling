'use client';

import { clientHentAlleSaker } from 'lib/clientApi';
import Link from 'next/link';
import useSWR from 'swr';
import { Button, Pagination, Table, TextField } from '@navikt/ds-react';
import { formaterDatoMedTidspunktForFrontend, sorterEtterNyesteDato } from 'lib/utils/date';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { SaksInfo } from 'lib/types/types';

function getSortedAndPaginatedData(
  data: SaksInfo[],
  searhString: string | null,
  page: number,
  itemsPerPage: number
): SaksInfo[] {
  return data
    .filter((sak) => !searhString || sak.ident.includes(searhString))
    .sort((a, b) => sorterEtterNyesteDato(a.opprettetTidspunkt, b.opprettetTidspunkt))
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);
}

export const AlleSakerListe = () => {
  const [page, setPage] = useState(1);
  const numPerPage = 100;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { data, mutate, isLoading, isValidating } = useSWR('api/sak/alle', clientHentAlleSaker);

  const searchValue = searchParams.get('ident');

  return (
    <div style={{ marginTop: '1rem', marginBottom: '2rem', gap: '1rem', display: 'flex', flexDirection: 'column' }}>
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
        <Button
          icon={<ArrowCirclepathIcon aria-hidden />}
          onClick={() => mutate()}
          size={'medium'}
          variant={'tertiary'}
          loading={isLoading || isValidating}
        >
          Refresh listen
        </Button>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Saksnummer</Table.HeaderCell>
            <Table.HeaderCell>Ident</Table.HeaderCell>
            <Table.HeaderCell>Opprettelsestidspunkt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.type === 'SUCCESS' &&
            getSortedAndPaginatedData(data.data, searchValue, page, numPerPage).map((sak) => (
              <Table.Row key={sak.saksnummer}>
                <Table.DataCell>
                  <Link href={`/saksbehandling/sak/${sak.saksnummer}/`} prefetch={false}>
                    {sak.saksnummer}
                  </Link>
                </Table.DataCell>
                <Table.DataCell>{sak.ident}</Table.DataCell>
                <Table.DataCell>{formaterDatoMedTidspunktForFrontend(sak.opprettetTidspunkt)}</Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {data?.type === 'SUCCESS' && data.data.length > numPerPage && (
        <Pagination page={page} onPageChange={setPage} count={Math.ceil(data.data.length / numPerPage)} size="small" />
      )}
    </div>
  );
};
