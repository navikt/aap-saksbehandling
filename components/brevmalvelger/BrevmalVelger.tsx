'use client';

import { Heading } from '@navikt/ds-react/esm/typography';
import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { Brevmaler, Nivå } from 'lib/services/sanityservice/sanityservice';
import { Select } from '@navikt/ds-react';
import { useBrev } from 'hooks/BrevHook';
import { PortableText } from 'lib/utils/sanity';

import styles from './BrevmalVelger.module.css';

export interface DelAvBrev {
  type: string;
  brukEditor: boolean;
  id: string;
  overskrift?: string;
  nivå?: Nivå;
}

export interface PortableTextMedRef {
  innhold: PortableText[];
  ref: string;
}

interface Props {
  brevmaler: Brevmaler[];
}

export const BrevmalVelger = ({ brevmaler }: Props) => {
  const { brevmal, setBrevmalId } = useBrev();
  const portableTextMedRef: PortableTextMedRef[] = [];

  const brevMedInnhold = brevmal?.innhold?.map((innhold) => {
    const delAvBrev: DelAvBrev = {
      type: innhold._type,
      brukEditor: false,
      id: innhold._id,
      overskrift: innhold.overskrift,
      nivå: innhold.niva,
    };

    if (innhold._type === 'systeminnhold') {
      if (innhold.systemNokkel === 'fritekst') {
        delAvBrev.brukEditor = true;
      }
    }

    if (innhold._type === 'standardtekst') {
      delAvBrev.brukEditor = innhold.kanRedigeres;
      const portableText = innhold?.innhold?.map((portableTextElement) => {
        const children = portableTextElement.children.map((child) => {
          // @ts-ignore
          if (child._type === 'systemVariabel') {
            return { ...child, text: 'Må innhentes fra systemet' };
          }

          return child;
        });

        return { ...portableTextElement, children: children.filter((child) => child.text) };
      });

      const standardtekst: PortableTextMedRef = {
        innhold: portableText,
        ref: innhold._id,
      };
      portableTextMedRef.push(standardtekst);
    }

    return delAvBrev;
  });

  return (
    <div className={styles.brevmalvelger}>
      <Select
        className={styles.brevmalvelgerSelect}
        label={'Velg brevmal'}
        onChange={(value) => setBrevmalId(value.target.value)}
      >
        {brevmaler?.map((mal) => (
          <option key={mal._id} value={mal._id}>
            {mal.brevtittel}
          </option>
        ))}
      </Select>

      <Heading size={'medium'}>{brevmal?.brevtittel}</Heading>
      {brevMedInnhold && <Brevbygger brevMedInnhold={brevMedInnhold} portableTextMedRef={portableTextMedRef} />}
    </div>
  );
};
