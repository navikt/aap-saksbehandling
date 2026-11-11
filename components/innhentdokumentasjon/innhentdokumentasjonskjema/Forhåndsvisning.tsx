import { Button, Dialog, Loader } from '@navikt/ds-react';
import { clientForhåndsvisDialogmelding } from 'lib/clientApi';
import useSWR from 'swr';
import { isError, isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';

type Props = {
  saksnummer: string;
  fritekst: string;
  dokumentasjonsType: 'L8' | 'L40';
  visModal: boolean;
  onClose: () => void;
};

export const Forhåndsvisning = ({ saksnummer, fritekst, dokumentasjonsType, visModal, onClose }: Props) => {
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
    <Dialog
      open={visModal}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Forhåndsvisning av melding</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          {isLoading && <Loader />}

          {!isLoading && isSuccess(data) && <p style={{ whiteSpace: 'pre-wrap' }}>{data.data.konstruertBrev}</p>}

          {isError(data) && (
            <Alert variant="error">{data.apiException.message || 'En ukjent feil oppsto ved forhåndsvisning'}</Alert>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Lukk forhåndsvisning
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
