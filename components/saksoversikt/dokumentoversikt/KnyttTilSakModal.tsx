import { Alert, BodyShort, Button, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { isError, isSuccess } from 'lib/utils/api';
import { clientKnyttTilAnnenSak } from 'lib/dokumentClientApi';

export interface KnyttTilAnnenSakRequest {
  bruker: {
    id: string;
    idType: string;
  };
  fagsakId: string;
  fagsaksystem: string;
  tema?: string | null;
}

export interface KnyttTilAnnenSakResponse {
  nyJournalpostId: string;
}

export const KnyttTilSakModal = ({
  journalpostId,
  tema,
  saksnummer,
  brukerIdent,
  isOpen,
  onClose,
  onSuccess,
}: {
  journalpostId: string;
  tema: string;
  saksnummer: string;
  brukerIdent: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const knyttTilAktivSak = async () => {
    setIsLoading(true);

    const result = await clientKnyttTilAnnenSak(journalpostId, {
      bruker: {
        id: brukerIdent,
        idType: 'FNR',
      },
      fagsakId: saksnummer,
      fagsaksystem: 'KELVIN',
      tema,
    });

    if (isSuccess(result)) {
      setIsLoading(false)
      onSuccess();
    } else if (isError(result)) {
      setError('En ukjent feil oppsto');
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} header={{ heading: 'Knytt til sak' }} onClose={onClose}>
      <Modal.Body>
        <BodyShort spacing>Er du sikker på at du vil knytte journalposten til sak {saksnummer}?</BodyShort>
      </Modal.Body>

      {error && <Alert variant="error">{error}</Alert>}

      <Modal.Footer>
        <Button type={'button'} onClick={knyttTilAktivSak} loading={isLoading}>
          Ja, knytt til sak
        </Button>
        <Button variant="secondary" disabled={isLoading} onClick={onClose}>
          Nei, avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
