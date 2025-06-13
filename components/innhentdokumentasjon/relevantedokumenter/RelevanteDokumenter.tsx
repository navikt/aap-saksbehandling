import { Alert, BodyShort, Checkbox, Heading, Loader, Table } from '@navikt/ds-react';
import { useSaksnummer } from 'hooks/BehandlingHook';
import useSWR from 'swr';

import styles from './RelevanteDokumenter.module.css';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { isError } from 'lib/utils/api';
import { clientHentRelevanteDokumenter } from 'lib/dokumentClientApi';

interface FormFields {
  dokumentnavn: string;
  dokumenttype: string;
}

type Variantformat = 'ARKIV' | 'SLADDET' | 'ORIGINAL';

export interface RelevantDokumentType {
  tema: string;
  dokumentInfoId: string;
  journalpostId: string;
  brevkode?: string;
  tittel: string;
  erUtgående: boolean;
  datoOpprettet: string;
  variantformat: Variantformat;
}

export const RelevanteDokumenter = () => {
  const saksnummer = useSaksnummer();
  const { data: relevanteDokumenter, isLoading } = useSWR(`/api/dokumenter/sak/${saksnummer}/helsedokumenter`, () =>
    clientHentRelevanteDokumenter(saksnummer)
  );

  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i helseopplysninger',
    },
    dokumenttype: {
      type: 'select',
      label: 'Vis typer',
      options: Array.from(
        new Set([
          ...[''],
          ...((relevanteDokumenter?.type === 'SUCCESS' &&
            relevanteDokumenter.data?.map((dokument) => dokument.variantformat)) ||
            []),
        ])
      ),
    },
  });

  if (isLoading) {
    return (
      <Alert variant="info">
        <Loader size={'small'} title="Søker etter relevante dokumenter" />
      </Alert>
    );
  }

  if (relevanteDokumenter && isError(relevanteDokumenter)) {
    return (
      <Alert variant={'error'} size={'small'}>
        {relevanteDokumenter.apiException.message}
      </Alert>
    );
  }

  if (relevanteDokumenter && relevanteDokumenter.data.length === 0) {
    return (
      <Alert size={'small'} variant="info">
        Fant ingen relevante helseopplysninger
      </Alert>
    );
  }

  return (
    <section className={styles.blaaBoks}>
      <div className={styles.heading}>
        <InformationSquareFillIcon className={styles.icon} />
        <div>
          <Heading level={'3'} size={'xsmall'}>
            Følgende helseopplysninger kan være relevant for saken
          </Heading>
          <BodyShort size={'small'} className={styles.beskrivelse}>
            NAV har tidligere mottatt følgende helseopplysninger som kan være relevant for brukers AAP sak. Velg
            dokumenter som er aktuelle for å koble de til saken.
          </BodyShort>
        </div>
      </div>
      <div className={styles.filterrad}>
        <FormField form={form} formField={formFields.dokumentnavn} />
        <FormField form={form} formField={formFields.dokumenttype} />
      </div>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Dokument</Table.HeaderCell>
            <Table.ColumnHeader textSize={'small'} sortable sortKey="type">
              Type
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {relevanteDokumenter?.data
            .filter(
              (dokument) =>
                !form.watch('dokumentnavn') ||
                dokument.tittel.toUpperCase().includes(form.watch('dokumentnavn').toUpperCase())
            )
            .filter((dokument) => !form.watch('dokumenttype') || dokument.variantformat === form.watch('dokumenttype'))
            .map((relevantDokument) => (
              <Table.Row key={relevantDokument.dokumentInfoId}>
                <Table.DataCell textSize={'small'}>
                  <Checkbox size={'small'} value={relevantDokument.dokumentInfoId}>
                    {relevantDokument.tittel}
                  </Checkbox>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{relevantDokument.variantformat}</Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </section>
  );
};
