'use client';

import { useEffect, useState } from 'react';
import { Modal, Button, Loader, BodyShort } from '@navikt/ds-react';
import styles from './ForhåndsvisBrevModal.module.css';

interface Props {
  isOpen: boolean;
  brevbestillingReferanse: string;
  onClose: () => void;
}

export const ForhåndsvisBrevModal = ({ isOpen, brevbestillingReferanse, onClose }: Props) => {
  const [dataUri, setDataUri] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      };
      hentDokument(brevbestillingReferanse);
    }
  }, [brevbestillingReferanse, isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Forhåndsvisning av brev' }} width="medium">
      <Modal.Body>
        {isLoading && (
          <div>
            <Loader size="xlarge" title="Laster forhåndsvisning av brev..." />
            <BodyShort spacing>Laster forhåndsvising av brev</BodyShort>
          </div>
        )}
        {dataUri && (
          <div className={styles.pdf}>
            <object data={`${dataUri}`} type="application/pdf">
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
