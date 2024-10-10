import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { ArrowRightIcon } from '@navikt/aksel-icons';

import { Link, Table } from '@navikt/ds-react';
import { DokumentInfo } from 'lib/types/types';

interface FormFields {
  dokumentnavn: string;
  dokumentType: string;
}

interface Props {
  dokumenter?: DokumentInfo[];
}

const dokumenterMock: DokumentInfo[] = [
  {
    tittel: 'søknad.pdf',
    dokumentInfoId: '123',
    journalpostId: '456',
    variantformat: 'ARKIV',
  },
  {
    tittel: 'legeerklæring.pdf',
    dokumentInfoId: '456',
    journalpostId: '789',
    variantformat: 'ARKIV',
  },
];

export const Saksdokumenter = ({ dokumenter = dokumenterMock }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i dokumenter',
    },
    dokumentType: {
      type: 'select',
      label: 'Vis typer',
      options: Array.from(new Set([...[''], ...(dokumenter?.map((dokument) => dokument.variantformat) || [])])),
    },
  });

  return (
    <div className={'flex-column'}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField form={form} formField={formFields.dokumentnavn} />
        <FormField form={form} formField={formFields.dokumentType} />
      </div>
      <Table size={'small'}>
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
          {dokumenter
            ?.filter((dokument) => !form.watch('dokumentnavn') || dokument.tittel.includes(form.watch('dokumentnavn')))
            .map((dokument) => {
              return (
                <Table.Row key={dokument.dokumentInfoId}>
                  <Table.DataCell align={'left'}>
                    <div style={{ display: 'flex' }}>
                      <ArrowRightIcon fontSize={'1.5rem'} />
                    </div>
                  </Table.DataCell>
                  <Table.DataCell align={'left'}>
                    <Link
                      href={`/api/dokument/${dokument.journalpostId}/${dokument.dokumentInfoId}`}
                      onClick={() => console.log('åpner dokument')}
                      target="_blank"
                    >
                      {dokument.tittel}
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell align={'left'}>{dokument.variantformat}</Table.DataCell>
                  <Table.DataCell align={'left'}>12.12.2024</Table.DataCell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
};
