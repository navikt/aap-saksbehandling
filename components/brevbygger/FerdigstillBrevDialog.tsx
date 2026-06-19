import { useEffect, useRef, useState } from 'react';
import { Button, Dialog } from '@navikt/ds-react';
import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';

import styles from './FerdigstillBrevDialog.module.css';

interface Props {
  referanse: string;
  isOpen: boolean;
  onClose: () => void;
  sendBrev: () => void;
  senderBrev: boolean;
}

export const FerdigstillBrevDialog = ({ referanse, isOpen, onClose, sendBrev, senderBrev }: Props) => {
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
        <Dialog.Footer>
          <Button type={'button'} variant={'secondary'} size={'small'} onClick={onClose} disabled={senderBrev}>
            Lukk
          </Button>
          <Button type={'button'} variant={'primary'} size={'small'} onClick={sendBrev} loading={senderBrev}>
            Send brev
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
