import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, HStack } from '@navikt/ds-react';
import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';

import styles from './FerdigstillBrevDialog.module.css';

import { ApiException } from 'lib/utils/api';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  referanse: string;
  isOpen: boolean;
  onClose: () => void;
  sendBrev: () => void;
  senderBrev: boolean;
  løsBehovStatus?: LøsBehovOgGåTilNesteStegStatus;
  løsBehovOgGåTilNesteStegError?: ApiException;
}

export const FerdigstillBrevDialog = ({
  referanse,
  isOpen,
  onClose,
  sendBrev,
  senderBrev,
  løsBehovStatus,
  løsBehovOgGåTilNesteStegError,
}: Props) => {
  const [lasterPdf, setLasterPdf] = useState<boolean>(false);
  const [pdfDataUri, setPdfDataUri] = useState<string | undefined>();
  const pdfDataUriRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      const getPdf = async () => {
        setLasterPdf(true);
        try {
          const blob = await fetch(`/saksbehandling/api/brev/${referanse}/forhandsvis/`).then((r) => r.blob());
          const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
          pdfDataUriRef.current = url;
          setPdfDataUri(url);
        } finally {
          setLasterPdf(false);
        }
      };
      getPdf();
    } else {
      setPdfDataUri(undefined);
      if (pdfDataUriRef.current) {
        URL.revokeObjectURL(pdfDataUriRef.current);
        pdfDataUriRef.current = undefined;
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Popup position="fullscreen">
        <Dialog.Header>
          <Dialog.Title>Ferdigstill brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className={styles.dialogBody}>
          <ForhåndsvisBrev isLoading={lasterPdf} dataUri={pdfDataUri} />
        </Dialog.Body>
        <Dialog.Footer className={styles.dialogFooter}>
          <div>
            <LøsBehovOgGåTilNesteStegStatusAlert
              status={løsBehovStatus}
              løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
            />
          </div>
          <HStack gap={'space-12'} align={'start'}>
            <Button type={'button'} variant={'secondary'} size={'medium'} onClick={onClose} disabled={senderBrev}>
              Lukk
            </Button>
            <Button type={'button'} variant={'primary'} size={'medium'} onClick={sendBrev} loading={senderBrev}>
              Send brev
            </Button>
          </HStack>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
