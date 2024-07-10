'use client';

import { PdfVisning } from 'components/pdfvisning/PdfVisning';
import { useEffect, useState } from 'react';
import { deserialize, Nivå } from 'lib/utils/sanity';
import { JSONContent } from '@tiptap/core';
import { Button, Heading, Detail } from '@navikt/ds-react';
import { Breveditor } from 'components/breveditor/Breveditor';
import Image from 'next/image';

import styles from './Brevbygger.module.css';

import { EyeIcon } from '@navikt/aksel-icons';
import { DelAvBrev, PortableTextMedRef } from 'components/brevmalvelger/BrevmalVelger';
import { formaterDatoForFrontend } from 'lib/utils/date';

import NavLogo from 'public/nav_logo.png';

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

export const Brevbygger = ({ tittel, brevMedInnhold, portableTextMedRef }: Props) => {
  const [brevData, setBrevData] = useState<BrevData[]>(byggBrev(brevMedInnhold, portableTextMedRef));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setBrevData(byggBrev(brevMedInnhold, portableTextMedRef));
  }, [brevMedInnhold, portableTextMedRef]);

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
    <div>
      <div className={styles.header}>
        <Heading size={'small'} level={'2'}>
          Vedtak
        </Heading>
        <Button variant={'secondary'} size={'small'} icon={<EyeIcon />} onClick={() => setIsOpen(!isOpen)}>
          Forhåndsvis brev
        </Button>
      </div>
      <div style={isOpen ? { display: 'flex', flexDirection: 'row' } : undefined}>
        <div className={styles.brevbygger}>
          <div className={styles.brev}>
            <div className={styles.brevPersonalia}>
              <Image src={NavLogo} width={110} height={70} alt={'NAV logo'} />
              <Detail>Navn: Ola Nordmann</Detail>
              <Detail>Fødselsnummer: 12345678910</Detail>
              <Detail>Dato: {formaterDatoForFrontend(new Date())}</Detail>
              <Detail>Saksnnummer: AABBCC</Detail>
            </div>
            <Heading size={'medium'} className={styles.brevtittel}>
              {tittel}
            </Heading>
            {brevMedInnhold.map((innhold) => {
              return (
                <div key={innhold.id} className={innhold.brukEditor ? styles.editableContent : ''}>
                  <div className={styles.headerRow}>
                    {innhold.overskrift && innhold.nivå && (
                      <Heading
                        size={mapNivåToHeadingSize(innhold.nivå)}
                        level={mapNivåToHeadingLevel(innhold.nivå)}
                        className={styles.heading}
                      >
                        {innhold.overskrift}
                      </Heading>
                    )}
                  </div>
                  <Breveditor
                    brukEditor={innhold.brukEditor}
                    setContent={(content) => {
                      updateBrevdata(content, innhold.id);
                    }}
                    initialValue={
                      innhold.systemContent ??
                      deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        <PdfVisning tittel={tittel} brevdata={brevData} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
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

function byggBrev(brevMedInnhold: DelAvBrev[], portableTextMedRef: PortableTextMedRef[]) {
  return brevMedInnhold.map((innhold) => ({
    _id: innhold.id,
    overskrift: innhold.overskrift,
    nivå: innhold.nivå,
    content:
      innhold.systemContent ?? deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold),
  }));
}
