import { Alert, Button, Loader, Modal } from '@navikt/ds-react';
import { clientForhåndsvisDialogmelding } from 'lib/clientApi';
import { useRef } from 'react';
import useSWR from 'swr';
import { isError, isSuccess } from 'lib/utils/api';

type Props = {
  saksnummer: string;
  fritekst: string;
  dokumentasjonsType: 'L8' | 'L40';
  visModal: boolean;
  onClose: () => void;
};

const formaterTekst = (input: string) => {
  const parts = input.split('\\n');
  const noNewline = parts.map((part) => part.replaceAll('\\n', ''));
  return noNewline;
};

export const Forhåndsvisning = ({ saksnummer, fritekst, dokumentasjonsType, visModal, onClose }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { data, isLoading } = useSWR(
    `forhåndsvisDialogmelding/${saksnummer}`,
    () =>
      clientForhåndsvisDialogmelding({
        saksnummer: saksnummer,
        dokumentasjonType: dokumentasjonsType,
        fritekst: fritekst,
      }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return (
    <Modal
      header={{ heading: 'Forhåndsvisning av melding' }}
      ref={modalRef}
      open={visModal}
      onClose={() => {
        modalRef.current?.close();
        onClose();
      }}
    >
      <Modal.Body>
        {isLoading && <Loader />}

        {!isLoading && isSuccess(data) && (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {formaterTekst(data.data.konstruertBrev).map((part, index) => (
              <p key={index}>{part}</p>
            ))}
          </div>
        )}

        {isError(data) && (
          <Alert variant="error">{data.apiException.message || 'En ukjent feil oppsto ved forhåndsvisning'}</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={() => modalRef.current?.close()}>
          Lukk forhåndsvisning
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
