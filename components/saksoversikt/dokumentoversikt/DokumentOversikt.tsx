import styles from './DokumentOversikt.module.css';
import { Box, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { Spinner } from 'components/felles/Spinner';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { ÅpneDokumentButton } from 'components/saksoversikt/dokumentoversikt/ÅpneDokumentButton';
import { HandlingerDokumentButton } from 'components/saksoversikt/dokumentoversikt/HandlingerDokumentButton';
import { SaksInfo } from 'lib/types/types';
import { clientHentAlleDokumenterPåBruker } from 'lib/dokumentClientApi';
import { erFerdigstilt, formaterJournalpostType, formaterJournalstatus } from 'lib/utils/journalpost';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Journalpost, Journalposttype, Journalstatus } from 'lib/types/journalpost';
import { TableStyled } from 'components/tablestyled/TableStyled';
import { useEffect, useState } from 'react';

interface FilterFormFields {
  tema: string[];
  typer: Journalposttype[];
  statuser: Journalstatus[];
}

interface HentDokumentoversiktBrukerRequest {
  personIdent: string;
  tema: string[];
  typer: Journalposttype[];
  statuser: Journalstatus[];
}

export const DokumentOversikt = ({ sak }: { sak: SaksInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [journalposter, setJournalposter] = useState<Journalpost[]>([]);

  const hent = async (request: HentDokumentoversiktBrukerRequest) => {
    setIsLoading(true);

    await clientHentAlleDokumenterPåBruker(request)
      .then((res) => {
        if (isSuccess(res)) setJournalposter(res.data);
        else throw Error(res.apiException.message);
      })
      .finally(() => setIsLoading(false));
  };

  const { form, formFields } = useConfigForm<FilterFormFields>({
    tema: {
      type: 'combobox_multiple',
      label: 'Tema',
      defaultValue: ['AAP'],
      options: [
        { value: 'AAP', label: 'Arbeidsavklaringspenger' },
        { value: 'SYK', label: 'Sykepenger' },
        { value: 'SYM', label: 'Sykmelding' },
        { value: 'OPP', label: 'Arbeidsoppfølging' },
      ],
    },
    typer: {
      type: 'combobox_multiple',
      label: 'Type',
      options: Object.keys(Journalposttype).map((value) => ({
        value,
        label: formaterJournalpostType(value as Journalposttype),
      })),
    },
    statuser: {
      type: 'combobox_multiple',
      label: 'Status',
      options: Object.keys(Journalstatus).map((value) => ({
        value,
        label: formaterJournalstatus(value as Journalstatus),
      })),
    },
  });

  const tema = form.watch('tema');
  const statuser = form.watch('statuser');
  const typer = form.watch('typer');

  useEffect(() => {
    hent({
      personIdent: sak.ident,
      tema: tema || [],
      statuser: statuser || [],
      typer: typer || [],
    });
  }, [tema, statuser, typer, sak.ident]);

  if (isLoading) {
    return <Spinner label="Henter dokumenter" />;
  }

  return (
    <VStack gap="4">
      <Heading size="large">Dokumentoversikt</Heading>

      <Box background="surface-subtle" padding="4" borderRadius="xlarge">
        <HStack gap="4">
          <FormField form={form} formField={formFields.tema} />
          <FormField form={form} formField={formFields.typer} />
          <FormField form={form} formField={formFields.statuser} />
        </HStack>
      </Box>

      <HStack>
        <TableStyled size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'}>ID</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Tittel</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Opprettet</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Avsender / mottaker</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Tema</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Type</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Status</Table.HeaderCell>
              <Table.HeaderCell textSize={'small'}>Sak</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {journalposter.map((journalpost) => (
              <Table.Row key={journalpost.journalpostId}>
                <Table.DataCell textSize={'small'}>{journalpost.journalpostId}</Table.DataCell>
                <Table.DataCell title={journalpost.tittel || ''} className={styles.ellipsis} textSize={'small'}>
                  {journalpost.tittel}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {journalpost.datoOpprettet && formaterDatoMedTidspunktForFrontend(journalpost.datoOpprettet)}
                </Table.DataCell>
                <Table.DataCell
                  textSize={'small'}
                  title={journalpost.avsenderMottaker?.navn || ''}
                  className={styles.ellipsis}
                >
                  {journalpost.avsenderMottaker?.navn}
                </Table.DataCell>
                <Table.DataCell textSize={'small'} title={journalpost.temanavn || ''}>
                  {journalpost.tema}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {journalpost.journalposttype && formaterJournalpostType(journalpost.journalposttype)}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  {journalpost.journalstatus && formaterJournalstatus(journalpost.journalstatus)}
                </Table.DataCell>
                <Table.DataCell textSize={'small'}>{journalpost.sak?.fagsakId}</Table.DataCell>
                <Table.DataCell textSize={'small'}>
                  <HStack gap="2" wrap={false}>
                    <ÅpneDokumentButton journalpost={journalpost} />
                    {/* TODO: Fjerne sjekk når vi har støtte for redigering av journalpost */}
                    {erFerdigstilt(journalpost.journalstatus) && (
                      <HandlingerDokumentButton sak={sak} journalpost={journalpost} />
                    )}
                  </HStack>
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </TableStyled>
      </HStack>
    </VStack>
  );
};
