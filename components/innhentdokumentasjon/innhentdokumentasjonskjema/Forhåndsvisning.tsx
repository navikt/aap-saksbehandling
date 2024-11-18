import { Alert, Button, Loader, Modal } from '@navikt/ds-react';
import { forhåndsvisDialogmelding } from 'lib/clientApi';
import { useRef } from 'react';
import useSWR from 'swr';

type Props = {
  saksnummer: string;
  fritekst: string;
  veilederNavn: string;
  dokumentasjonsType: 'L8' | 'L40';
  visModal: boolean;
  onClose: () => void;
};

const formaterTekst = (input: string) => {
  const parts = input.split('\\n');
  const noNewline = parts.map((part) => part.replaceAll('\\n', ''));
  return noNewline;
};

export const Forhåndsvisning = ({
  saksnummer,
  fritekst,
  veilederNavn,
  dokumentasjonsType,
  visModal,
  onClose,
}: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { data, isLoading, error } = useSWR(
    `forhåndsvisDialogmelding/${saksnummer}`,
    () =>
      forhåndsvisDialogmelding({
        saksnummer: saksnummer,
        veilederNavn: veilederNavn,
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
        {error && <Alert variant="error">Klarte ikke å forhåndsvise melding</Alert>}
        {data && (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {formaterTekst(data.konstruertBrev).map((part, index) => (
              <p key={index}>{part}</p>
            ))}
          </div>
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
