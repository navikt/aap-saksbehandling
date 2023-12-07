'use client';

import { Brevbygger } from 'components/brevbygger/Brevbygger';
import { Select } from '@navikt/ds-react';
import { useBrev } from 'hooks/BrevHook';
import { Brevmaler, Nivå, PortableText } from 'lib/utils/sanity';

import styles from './BrevmalVelger.module.css';
import { JSONContent } from '@tiptap/react';

export interface DelAvBrev {
  type: string;
  brukEditor: boolean;
  id: string;
  overskrift?: string;
  nivå?: Nivå;
  systemContent?: JSONContent;
  hjelpetekst?: PortableText[];
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
      if (innhold.systemNokkel === 'vedtak_vedlegg') {
        const jsonContent: JSONContent = {
          type: 'doc',
          content: [
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'Søknad om arbeidsavklaringspenger' }],
                },
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'Legeerklæring' }],
                },
                {
                  type: 'listItem',
                  content: [{ type: 'text', text: 'Inntektsmelding fra Skatteetaten' }],
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Du har rett til å se dokumentene i saken din. Du kan se dokumentene på ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'underline',
                    },
                  ],
                  text: 'nav.no/mine-aap',
                },
                {
                  type: 'text',
                  text: '.',
                },
              ],
            },
          ],
        };
        delAvBrev.systemContent = jsonContent;
      }
    }

    if (innhold._type === 'standardtekst') {
      delAvBrev.brukEditor = innhold.kanRedigeres;
      delAvBrev.hjelpetekst = innhold.hjelpetekst;

      const portableText = innhold?.innhold?.map((portableTextElement) => {
        const children = portableTextElement.children.map((child) => {
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
        <option value={''}></option>
        {brevmaler.map((mal) => (
          <option key={mal._id} value={mal._id}>
            {mal.brevtype}
          </option>
        ))}
      </Select>

      {brevMedInnhold && (
        <Brevbygger
          tittel={brevmal?.brevtittel ?? ''}
          brevMedInnhold={brevMedInnhold}
          portableTextMedRef={portableTextMedRef}
        />
      )}
    </div>
  );
};
