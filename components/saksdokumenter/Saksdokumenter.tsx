import { Link, Table, VStack } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';
import useSWR from 'swr';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { ArrowOrange } from 'components/icons/ArrowOrange';
import { ArrowGreen } from 'components/icons/ArrowGreen';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { clientHentAlleDokumenterPåSak } from 'lib/dokumentClientApi';

interface FormFields {
  dokumentnavn: string;
  dokumentType: string;
}

export const Saksdokumenter = () => {
  const saksnummer = useSaksnummer();
  const { data: dokumenterPåSak } = useSWR(`api/dokumenter/sak/${saksnummer}`, () =>
    clientHentAlleDokumenterPåSak(saksnummer)
  );

  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i dokumenter',
    },
    dokumentType: {
      type: 'select',
      label: 'Vis typer',
      options: Array.from(
        new Set([
          ...[''],
          ...((dokumenterPåSak?.type === 'SUCCESS' &&
            dokumenterPåSak?.data?.map((dokument) => dokument.variantformat)) ||
            []),
        ])
      ),
    },
  });

  if (dokumenterPåSak?.type === 'ERROR') {
    return <ApiException apiResponses={[dokumenterPåSak]} />;
  }

  return (
    <VStack gap={'4'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField form={form} formField={formFields.dokumentnavn} />
        <FormField form={form} formField={formFields.dokumentType} />
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
              Type
            </Table.HeaderCell>
            <Table.HeaderCell align={'left'} textSize={'small'}>
              Journalført
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dokumenterPåSak?.data
            ?.filter((dokument) => !form.watch('dokumentnavn') || dokument.tittel.includes(form.watch('dokumentnavn')))
            .filter((dokument) => !form.watch('dokumentType') || dokument.variantformat === form.watch('dokumentType'))
            .map((dokument) => {
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
    </VStack>
  );
};
