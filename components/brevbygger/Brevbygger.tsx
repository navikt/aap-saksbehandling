'use client';

import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useState } from 'react';
import { deserialize } from 'lib/utils/sanity';
import { JSONContent } from '@tiptap/core';
import { Button } from '@navikt/ds-react';
import { Breveditor } from 'components/breveditor/Breveditor';

import styles from './Brevbygger.module.css';
import { Heading } from '@navikt/ds-react/esm/typography';
import { Nivå } from 'lib/services/sanityservice/sanityservice';
import { DelAvBrev, PortableTextMedRef } from 'components/brevmalvelger/BrevmalVelger';

interface Props {
  tittel: string;
  brevMedInnhold: DelAvBrev[];
  portableTextMedRef: PortableTextMedRef[];
}
export type BrevData = {
  _id: string;
  overskrift?: string;
  nivå?: Nivå;
  content: JSONContent;
};
function byggBrev(brevMedInnhold: DelAvBrev[], portableTextMedRef: PortableTextMedRef[]) {
  return brevMedInnhold.map((innhold) => ({
    _id: innhold.id,
    overskrift: innhold.overskrift,
    nivå: innhold.nivå,
    content: deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold),
  }));
}

export const Brevbygger = ({ tittel, brevMedInnhold, portableTextMedRef }: Props) => {
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
                  {innhold.overskrift && innhold.nivå && (
                    <Heading
                      size={mapNivåToHeadingSize(innhold.nivå)}
                      level={mapNivåToHeadingLevel(innhold.nivå)}
                      className={styles.heading}
                    >
                      {innhold.overskrift}
                    </Heading>
                  )}
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

        {isOpen && <PdfVisning tittel={tittel} brevdata={brevData} />}
      </div>
    </>
  );
};

function mapNivåToHeadingSize(nivå: Nivå): 'small' | 'medium' | 'large' {
  switch (nivå) {
    case 'H1':
      return 'large';
    case 'H2':
      return 'medium';
    case 'H3':
      return 'small';
  }
}

function mapNivåToHeadingLevel(nivå: Nivå): '1' | '2' | '3' {
  switch (nivå) {
    case 'H1':
      return '1';
    case 'H2':
      return '2';
    case 'H3':
      return '3';
  }
}
