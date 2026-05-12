import { useEffect, useState } from 'react';
import { Button, Dialog } from '@navikt/ds-react';
import { ForhåndsvisBrev } from 'components/brevbygger/ForhåndsvisBrev';

import styles from './FerdigstillBrevDialog.module.css';

interface Props {
  referanse: string;
  isOpen: boolean;
  onClose: () => void;
  sendBrev: () => void;
}

export const FerdigstillBrevDialog = ({ referanse, isOpen, onClose, sendBrev }: Props) => {
  const [lasterPdf, setLasterPdf] = useState<boolean>(false);
  const [pdfDataUri, setPdfDataUri] = useState<string | undefined>();

  useEffect(() => {
    const getPdf = async () => {
      setLasterPdf(true);
      const blob = await fetch(`/saksbehandling/api/brev/${referanse}/forhandsvis/`).then((r) => r.blob());
      setPdfDataUri(URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })));
      setLasterPdf(false);
    };
    if (isOpen) {
      getPdf();
    }
    return () => {
      if (pdfDataUri) URL.revokeObjectURL(pdfDataUri);
    };
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
          <Button type={'button'} variant={'secondary'} size={'small'} onClick={onClose}>
            Lukk
          </Button>
          <Button type={'button'} variant={'primary'} size={'small'} onClick={sendBrev}>
            Send brev
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
