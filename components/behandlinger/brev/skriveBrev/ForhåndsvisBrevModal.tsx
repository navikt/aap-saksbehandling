'use client';

import { useEffect, useState } from 'react';
import { Modal, Button } from '@navikt/ds-react';
import styles from './ForhåndsvisBrevModal.module.css';

interface Props {
  isOpen: boolean;
  brevbestillingReferanse: string;
  onClose: () => void;
}

export const ForhåndsvisBrevModal = ({ isOpen, brevbestillingReferanse, onClose }: Props) => {
  const [dataUri, setDataUri] = useState<string>();

  useEffect(() => {
    // Unngår å gjøre kallet når modalen er lukket.
    if (isOpen) {
      const hentDokument = async (brevbestillingReferanse: string) => {
        fetch(`/saksbehandling/api/brev/${brevbestillingReferanse}/forhandsvis/`, { method: 'GET' })
          .then((res) => res.blob())
          .then((blob: Blob) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            new Promise((res) => {
              reader.onloadend = function () {
                res(reader.result);
              };
            }).then((dataUri) => setDataUri(dataUri as string));
          });
      };
      hentDokument(brevbestillingReferanse);
    }
  }, [brevbestillingReferanse, isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Forhåndsvisning av brev' }}>
      <Modal.Body>
        {dataUri && (
          <div className={styles.pdf}>
            <object data={`${dataUri}#toolbar=0`} type="application/pdf" width="100%" height="100%">
              <p>Forhåndsvisning av brev</p>
            </object>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Lukk</Button>
      </Modal.Footer>
    </Modal>
  );
};
