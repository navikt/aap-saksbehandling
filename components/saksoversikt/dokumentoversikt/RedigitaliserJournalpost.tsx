import { Alert, BodyShort, Button, Modal, Table } from '@navikt/ds-react';
import { isError, isSuccess } from 'lib/utils/api';
import { useState } from 'react';
import { Journalpost } from 'lib/types/journalpost';
import { redigitaliserDokument } from 'lib/postmottakClientApi';
import { SaksInfo } from 'lib/types/types';

export const RedigitaliserJournalpost = ({
  sak,
  journalpost,
  isOpen,
  onClose,
}: {
  sak: SaksInfo;
  journalpost: Journalpost;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const redigitaliser = async () => {
    setIsLoading(true);

    let result;
    result = await redigitaliserDokument(Number(journalpost.journalpostId), sak.saksnummer);

    if (isSuccess(result)) {
      window.location.reload();
    } else if (isError(result)) {
      setError('En ukjent feil oppsto');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      header={{
        heading: 'Redigitaliser dokument',
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyShort spacing>
          Er du sikker på at du vil redigitalisere journalposten? Det vil bli opprettet en ny digitaliseringsoppgave i
          postmottaket.
        </BodyShort>

        <Table>
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell>JournalpostID:</Table.HeaderCell>
              <Table.DataCell>{journalpost.journalpostId}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Tittel:</Table.HeaderCell>
              <Table.DataCell>{journalpost.tittel}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>FagsakID:</Table.HeaderCell>
              <Table.DataCell>{journalpost.sak?.fagsakId}</Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Body>

      {error && <Alert variant="error">{error}</Alert>}

      <Modal.Footer>
        <Button variant="primary" onClick={redigitaliser} loading={isLoading}>
          Ja, redigitaliser
        </Button>
        <Button variant="secondary" disabled={isLoading}>
          Nei, avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
