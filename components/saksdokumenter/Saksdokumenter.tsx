import { Link, Pagination, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import useSWR from 'swr';
import { useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { ArrowOrange } from 'components/icons/ArrowOrange';
import { ArrowGreen } from 'components/icons/ArrowGreen';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { clientHentAlleDokumenterPåSak } from 'lib/dokumentClientApi';
import { isError } from 'lib/utils/api';
import { useState } from 'react';

interface FormFields {
  dokumentnavn: string;
}

export const Saksdokumenter = () => {
  const saksnummer = useSaksnummer();
  const { data: dokumenterPåSak } = useSWR(`api/dokumenter/sak/${saksnummer}`, () =>
    clientHentAlleDokumenterPåSak(saksnummer)
  );
  const [pageState, setPageState] = useState(1);
  const dokumenterPerPage = 7;

  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i dokumenter',
    },
  });

  if (isError(dokumenterPåSak)) {
    return <ApiException apiResponses={[dokumenterPåSak]} />;
  }

  const dokumenterFiltrertPåSøk =
    dokumenterPåSak?.data?.filter(
      (dokument) => !form.watch('dokumentnavn') || dokument.tittel.includes(form.watch('dokumentnavn'))
    ) || [];

  const skalVisePaginering = dokumenterFiltrertPåSøk.length > dokumenterPerPage;

  const antallSider =
    dokumenterFiltrertPåSøk.length > dokumenterPerPage
      ? Math.ceil(dokumenterFiltrertPåSøk.length / dokumenterPerPage)
      : 1;

  const dokumenterForValgtSide = skalVisePaginering
    ? dokumenterFiltrertPåSøk.slice((pageState - 1) * dokumenterPerPage, pageState * dokumenterPerPage)
    : dokumenterFiltrertPåSøk;

  return (
    <VStack gap={'4'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField form={form} formField={formFields.dokumentnavn} />
      </div>
      <TableStyled size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell align={'left'} textSize={'small'}>
              Inn / ut
            </Table.HeaderCell>
            <Table.HeaderCell align={'left'} textSize={'small'}>
              Dokument
            </Table.HeaderCell>
            <Table.HeaderCell align={'left'} textSize={'small'}>
              Brevkode
            </Table.HeaderCell>
            <Table.HeaderCell align={'left'} textSize={'small'}>
              Journalført
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dokumenterForValgtSide.map((dokument) => {
            return (
              <Table.Row key={dokument.dokumentInfoId}>
                <Table.DataCell align={'left'}>
                  <div style={{ display: 'flex', minWidth: '3rem' }}>
                    {dokument.erUtgående ? (
                      <ArrowOrange title={'Utgående dokument'} />
                    ) : (
                      <ArrowGreen title={'Inngående dokument'} />
                    )}
                  </div>
                </Table.DataCell>
                <Table.DataCell align={'left'}>
                  <Link
                    href={`/saksbehandling/api/dokumenter/${dokument.journalpostId}/${dokument.dokumentInfoId}`}
                    target="_blank"
                  >
                    {dokument.tittel}
                  </Link>
                </Table.DataCell>
                <Table.DataCell align={'left'}>{dokument.brevkode}</Table.DataCell>
                <Table.DataCell align={'left'}>{formaterDatoForFrontend(dokument.datoOpprettet)}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </TableStyled>
      {skalVisePaginering && (
        <VStack align={'center'}>
          <Pagination
            page={pageState}
            onPageChange={setPageState}
            count={antallSider}
            boundaryCount={1}
            siblingCount={1}
            size={'small'}
            srHeading={{
              tag: 'h2',
              text: 'Tabellpaginering',
            }}
          />
        </VStack>
      )}
    </VStack>
  );
};
