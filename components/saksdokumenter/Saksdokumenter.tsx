import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';

import { Link, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Dokument {
  navn: string;
  journalpostId: string;
  dokumentId: string;
  type: string;
  journalførtDato: string;
  ekstern: boolean;
}

interface FormFields {
  dokumentnavn: string;
  dokumentType: string;
}

interface Props {
  dokumenter?: Dokument[];
}

const dokumenterMock: Dokument[] = [
  {
    navn: 'søknad.pdf',
    journalførtDato: '2025.12.12',
    dokumentId: '123',
    journalpostId: '456',
    type: 'type',
    ekstern: true,
  },
  {
    navn: 'legeerklæring.pdf',
    journalførtDato: '2024.12.12',
    dokumentId: '456',
    journalpostId: '789',
    type: 'type',
    ekstern: true,
  },
];

export const Saksdokumenter = ({ dokumenter = dokumenterMock }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i dokumenter',
    },
    dokumentType: {
      type: 'text',
      label: 'Vis typer',
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
            <Table.HeaderCell align={'center'}>Inn / ut</Table.HeaderCell>
            <Table.HeaderCell align={'center'}>Dokument</Table.HeaderCell>
            <Table.ColumnHeader sortable align={'center'}>
              Type
            </Table.ColumnHeader>
            <Table.ColumnHeader sortable align={'center'}>
              Journalført
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dokumenter?.map((dokument) => {
            return (
              <Table.Row key={dokument.dokumentId}>
                <Table.DataCell align={'center'}>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {dokument.ekstern ? <ArrowRightIcon fontSize={'1.5rem'} /> : <ArrowLeftIcon fontSize={'1.5rem'} />}
                  </div>
                </Table.DataCell>
                <Table.DataCell align={'center'}>
                  <Link
                    href={`/api/dokument/${dokument.journalpostId}/${dokument.dokumentId}`}
                    onClick={() => console.log('åpner dokument')}
                    target="_b∏lank"
                  >
                    {dokument.navn}
                  </Link>
                </Table.DataCell>
                <Table.DataCell align={'center'}>{dokument.type}</Table.DataCell>
                <Table.DataCell align={'center'}>{formaterDatoForFrontend(dokument.journalførtDato)}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
