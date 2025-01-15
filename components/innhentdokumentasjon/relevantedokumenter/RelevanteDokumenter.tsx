import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Alert, BodyShort, Checkbox, Loader, Table } from '@navikt/ds-react';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { clientHentRelevanteDokumenter } from 'lib/clientApi';
import useSWR from 'swr';

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
  const { data: relevanteDokumenter, isLoading } = useSWR(`/api/dokumentinnhenting/saf/${saksnummer}`, () =>
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
        new Set([...[''], ...(relevanteDokumenter?.map((dokument) => dokument.variantformat) || [])])
      ),
    },
  });

  if (isLoading) {
    return (
      <Alert variant="info">
        <Loader title="Søker etter relevante dokumenter" />
      </Alert>
    );
  }

  if (relevanteDokumenter && relevanteDokumenter?.length === 0) {
    return <Alert variant="info">Fant ingen relevante helseopplysninger</Alert>;
  }

  return (
    <div style={{ marginTop: '1rem', border: '1px solid #000', padding: '0.5rem' }}>
      <Alert variant="info">Følgende helseopplysninger kan være relevant for saken</Alert>
      <BodyShort>
        NAV har tidligere mottatt følgende helseopplysninger som kan være relevant for innbyggers AAP sak. Velg
        dokumenter som er aktuelle for å koble de til saken.
      </BodyShort>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <FormField form={form} formField={formFields.dokumentnavn} />
        <FormField form={form} formField={formFields.dokumenttype} />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Dokument</Table.HeaderCell>
            <Table.ColumnHeader sortable sortKey="type">
              Type
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {relevanteDokumenter
            ?.filter(
              (dokument) =>
                !form.watch('dokumentnavn') ||
                dokument.tittel.toUpperCase().includes(form.watch('dokumentnavn').toUpperCase())
            )
            .filter((dokument) => !form.watch('dokumenttype') || dokument.variantformat === form.watch('dokumenttype'))
            .map((relevantDokument) => (
              <Table.Row key={relevantDokument.dokumentInfoId}>
                <Table.DataCell>
                  <Checkbox value={relevantDokument.dokumentInfoId}>{relevantDokument.tittel}</Checkbox>
                </Table.DataCell>
                <Table.DataCell>{relevantDokument.variantformat}</Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};
