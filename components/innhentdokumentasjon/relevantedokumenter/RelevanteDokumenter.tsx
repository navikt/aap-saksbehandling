import { Alert, BodyShort, Heading, Link, Loader, Table } from '@navikt/ds-react';
import useSWR from 'swr';

import styles from './RelevanteDokumenter.module.css';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { isError } from 'lib/utils/api';
import { clientHentRelevanteDokumenter } from 'lib/dokumentClientApi';
import { useSak } from 'hooks/SakHook';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface FormFields {
  dokumentnavn: string;
  tema: string;
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
  const sak = useSak();

  const { data: relevanteDokumenter, isLoading } = useSWR(`/api/dokumenter/bruker/helsedokumenter`, () =>
    clientHentRelevanteDokumenter(sak.sak.saksnummer, sak.sak.ident)
  );

  const { form, formFields } = useConfigForm<FormFields>({
    dokumentnavn: {
      type: 'text',
      label: 'Søk i helseopplysninger',
    },
    tema: {
      type: 'select',
      label: 'Tema',
      options: Array.from(
        new Set([
          ...[''],
          ...((relevanteDokumenter?.type === 'SUCCESS' && relevanteDokumenter.data?.map((dokument) => dokument.tema)) ||
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

  if (relevanteDokumenter?.data.length === 0) {
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
        <FormField form={form} formField={formFields.tema} />
      </div>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Dokument</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Tema</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Brevkode</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Journalført</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {relevanteDokumenter?.data
            .filter(
              (dokument) =>
                !form.watch('dokumentnavn') ||
                dokument.tittel.toUpperCase().includes(form.watch('dokumentnavn').toUpperCase())
            )
            .filter((dokument) => !form.watch('tema') || dokument.tema === form.watch('tema'))
            .map((dokument) => (
              <Table.Row key={dokument.dokumentInfoId}>
                <Table.DataCell textSize={'small'}>
                  <Link
                    href={`/saksbehandling/api/dokumenter/${dokument.journalpostId}/${dokument.dokumentInfoId}`}
                    target="_blank"
                  >
                    {dokument.tittel}
                  </Link>
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{dokument.tema}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{dokument.brevkode}</Table.DataCell>
                <Table.DataCell textSize={'small'}>{formaterDatoForFrontend(dokument.datoOpprettet)}</Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </section>
  );
};
