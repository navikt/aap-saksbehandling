'use client';

import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useState } from 'react';
import { deserialize } from 'lib/utils/sanity';
import { DelAvBrev, PortableTextMedRef } from 'app/sanity/page';
import { JSONContent } from '@tiptap/core';
import { Button } from '@navikt/ds-react';
import { Breveditor } from 'components/breveditor/Breveditor';

import styles from './Brevbygger.module.css';

interface Props {
  brevMedInnhold: DelAvBrev[];
  portableTextMedRef: PortableTextMedRef[];
}
type BrevData = {
  _id: string;
  content: JSONContent;
};
function byggBrev(brevMedInnhold: DelAvBrev[], portableTextMedRef: PortableTextMedRef[]) {
  return brevMedInnhold.map((innhold) => ({
    _id: innhold.id,
    content: deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold),
  }));
}

export const Brevbygger = ({ brevMedInnhold, portableTextMedRef }: Props) => {
  const [brevData, setBrevData] = useState<BrevData[]>(byggBrev(brevMedInnhold, portableTextMedRef));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function updateBrevdata(content: JSONContent, id: string) {
    setBrevData(
      brevData.map((brev) => {
        if (brev._id === id) {
          return {
            ...brev,
            content,
          };
        }
        return brev;
      })
    );
  }

  return (
    <>
      <Button variant={'primary'} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Skjul pdf' : 'Vis pdf'}
      </Button>
      <div style={isOpen ? { display: 'flex', flexDirection: 'row' } : undefined}>
        <div className={styles.brevbygger}>
          <div className={styles.brev}>
            {brevMedInnhold.map((innhold) => {
              return (
                <div key={innhold.id}>
                  {innhold.overskrift && <div>{innhold.overskrift}</div>}
                  <Breveditor
                    brukEditor={innhold.brukEditor}
                    setContent={(content) => {
                      updateBrevdata(content, innhold.id);
                    }}
                    initialValue={deserialize(
                      portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {isOpen && <PdfVisning content={brevData.flatMap((brev) => brev.content?.content)} />}
      </div>
    </>
  );
};
