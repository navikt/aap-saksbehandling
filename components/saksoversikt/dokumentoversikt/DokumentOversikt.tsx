import styles from './DokumentOversikt.module.css';
import { Heading, HStack, Table, VStack } from '@navikt/ds-react';
import useSWR from 'swr';
import { Spinner } from 'components/felles/Spinner';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { ÅpneDokumentButton } from 'components/saksoversikt/dokumentoversikt/ÅpneDokumentButton';
import { HandlingerDokumentButton } from 'components/saksoversikt/dokumentoversikt/HandlingerDokumentButton';
import { SaksInfo } from 'lib/types/types';
import { clientHentAlleDokumenterPåBruker } from 'lib/dokumentClientApi';
import { erFerdigstilt } from 'lib/utils/journalpost';

const formaterJournalpostType = (type: string) => {
  switch (type) {
    case 'I':
      return 'Inngående';
    case 'U':
      return 'Utgående';
    case 'N':
      return 'Notat';
    default:
      return `Ukjent type (${type})`;
  }
};

const formaterStatus = (status: string) => {
  switch (status) {
    case 'UTGAAR':
      return 'Utgår';
    case 'UNDER_ARBEID':
      return 'Under arbeid';
    case 'UKJENT_BRUKER':
      return 'Ukjent bruker';
    case 'UKJENT':
      return 'Ukjent';
    case 'RESERVERT':
      return 'Reservert';
    case 'OPPLASTING_DOKUMENT':
      return 'Opplasting dokument';
    case 'MOTTATT':
      return 'Mottatt';
    case 'JOURNALFOERT':
      return 'Journalført';
    case 'FERDIGSTILT':
      return 'Ferdigstilt';
    case 'FEILREGISTRERT':
      return 'Feilregistrert';
    case 'EKSPEDERT':
      return 'Ekspedert';
    case 'AVBRUTT':
      return 'Avbrutt';
  }
};

export const DokumentOversikt = ({ sak }: { sak: SaksInfo }) => {
  const { data, isLoading } = useSWR(`/saksbehandling/api/dokumenter/bruker`, () =>
    clientHentAlleDokumenterPåBruker(sak.ident)
  );

  if (isLoading) {
    return <Spinner label="Henter dokumenter" />;
  }

  return (
    <VStack gap="4">
      <Heading size="large">Dokumentoversikt</Heading>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Tittel</Table.HeaderCell>
            <Table.HeaderCell>Opprettet</Table.HeaderCell>
            <Table.HeaderCell>Avsender / mottaker</Table.HeaderCell>
            <Table.HeaderCell>Tema</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Sak</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isSuccess(data) &&
            data?.data?.map((journalpost) => (
              <Table.Row key={journalpost.journalpostId}>
                <Table.DataCell>{journalpost.journalpostId}</Table.DataCell>
                <Table.DataCell title={journalpost.tittel || ''} className={styles.ellipsis}>
                  {journalpost.tittel}
                </Table.DataCell>
                <Table.DataCell>
                  {journalpost.datoOpprettet && formaterDatoMedTidspunktForFrontend(journalpost.datoOpprettet)}
                </Table.DataCell>
                <Table.DataCell title={journalpost.avsenderMottaker?.navn || ''} className={styles.ellipsis}>
                  {journalpost.avsenderMottaker?.navn}
                </Table.DataCell>
                <Table.DataCell title={journalpost.temanavn || ''}>{journalpost.tema}</Table.DataCell>
                <Table.DataCell>
                  {journalpost.journalposttype && formaterJournalpostType(journalpost.journalposttype)}
                </Table.DataCell>
                <Table.DataCell>
                  {journalpost.journalstatus && formaterStatus(journalpost.journalstatus)}
                </Table.DataCell>
                <Table.DataCell>{journalpost.sak?.fagsakId}</Table.DataCell>
                <Table.DataCell>
                  <HStack gap="2" wrap={false} justify="end">
                    {/* TODO: Fjerne sjekk når vi har støtte for redigering av journalpost */}
                    {erFerdigstilt(journalpost.journalstatus) && (
                      <HandlingerDokumentButton sak={sak} journalpost={journalpost} />
                    )}

                    <ÅpneDokumentButton journalpost={journalpost} />
                  </HStack>
                </Table.DataCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </VStack>
  );
};
