'use client';

import { useEffect, useState } from 'react';
import { Dialog, Button, Loader, BodyShort } from '@navikt/ds-react';
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
    if (!isOpen) return;

    let objectURL: string | undefined;
    const hentDokument = async (brevbestillingReferanse: string) => {
      const blob = await fetch(`/saksbehandling/api/brev/${brevbestillingReferanse}/forhandsvis/`, {
        method: 'GET',
      }).then((res) => res.blob());

      objectURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      setDataUri(objectURL);

      setIsLoading(false);
    };

    hentDokument(brevbestillingReferanse);

    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [brevbestillingReferanse, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup width="43.75rem" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Forhåndsvisning av brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
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
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={onClose}>Lukk</Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
