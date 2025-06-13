import { Journalpost } from 'lib/types/types';
import { Alert, BodyShort, Button, Modal, Table } from '@navikt/ds-react';
import { isError, isSuccess } from 'lib/utils/api';
import { useState } from 'react';
import { feilregistrerSakstilknytning, opphevFeilregistrertSakstilknytning } from 'lib/dokumentClientApi';

export const FeilregistrerJournalpostModal = ({
  journalpost,
  isOpen,
  onClose,
}: {
  journalpost: Journalpost;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const feilregistrer = async () => {
    setIsLoading(true);

    let result;
    if (journalpost.journalstatus === 'FEILREGISTRERT') {
      result = await opphevFeilregistrertSakstilknytning(journalpost.journalpostId);
    } else {
      result = await feilregistrerSakstilknytning(journalpost.journalpostId);
    }

    if (isSuccess(result)) {
      window.location.reload();
    } else if (isError(result)) {
      setError('En ukjent feil oppsto');
      setIsLoading(false);
    }
  };

  if (journalpost.journalstatus === 'FEILREGISTRERT') {
    return (
      <Modal
        open={isOpen}
        header={{
          heading: 'Opphev feilregistrert sakstilknytning',
        }}
        onClose={onClose}
      >
        <Modal.Body>
          <BodyShort spacing>
            Er du sikker på at du vil oppheve den feilregistrerte sakstilknytningen på journalposten? Når du gjør dette
            vil journalposten få statusen den hadde før den ble feilregistrert.
          </BodyShort>
        </Modal.Body>

        {error && <Alert variant="error">{error}</Alert>}

        <Modal.Footer>
          <Button variant="primary" onClick={feilregistrer} loading={isLoading}>
            Ja, opphev
          </Button>
          <Button variant="secondary" disabled={isLoading}>
            Nei, avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal
      open={isOpen}
      header={{
        heading: 'Feilregistrer sakstilknytning',
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyShort spacing>
          Er du sikker på at du vil feilregistrere sakstilknytningen på journalposten? Når du gjør dette vil
          journalposten markeres med status <i>feilregistrert</i>.
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
        <Button variant="danger" onClick={feilregistrer} loading={isLoading}>
          Ja, feilregistrer
        </Button>
        <Button variant="secondary" disabled={isLoading}>
          Nei, avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
