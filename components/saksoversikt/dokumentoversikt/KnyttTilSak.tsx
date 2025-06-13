import { Journalpost, SaksInfo } from 'lib/types/types';
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
}

export interface KnyttTilAnnenSakResponse {
  nyJournalpostId: string;
}

export const KnyttTilSak = ({
  journalpost,
  sak,
  isOpen,
  onClose,
}: {
  journalpost: Journalpost;
  sak: SaksInfo;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const knyttTilAktivSak = async () => {
    setIsLoading(true);

    const result = await clientKnyttTilAnnenSak(journalpost.journalpostId, {
      bruker: {
        id: sak.ident,
        idType: 'FNR',
      },
      fagsakId: sak.saksnummer,
      fagsaksystem: 'KELVIN',
    });

    if (isSuccess(result)) {
      window.location.reload();
    } else if (isError(result)) {
      setError('En ukjent feil oppsto');
      setIsLoading(false)
    }
  };

  return (
    <Modal open={isOpen} header={{ heading: 'Knytt til sak' }} onClose={onClose}>
      <Modal.Body>
        <BodyShort spacing>Er du sikker på at du vil knytte journalposten til sak {sak.saksnummer}?</BodyShort>
      </Modal.Body>

      {error && <Alert variant="error">{error}</Alert>}

      <Modal.Footer>
        <Button type={'button'} onClick={knyttTilAktivSak} loading={isLoading}>
          Ja, knytt til sak
        </Button>
        <Button variant="secondary" disabled={isLoading}>
          Nei, avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
