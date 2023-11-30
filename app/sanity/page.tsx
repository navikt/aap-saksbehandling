import { hentBrevmalerFraSanity } from 'lib/services/sanityservice/sanityservice';
import { PortableText } from 'lib/utils/sanity';
import { Heading } from '@navikt/ds-react/esm/typography';
import { Brevbygger } from 'components/brevbygger/Brevbygger';

export interface DelAvBrev {
  type: string;
  brukEditor: boolean;
  id: string;
}

export interface PortableTextMedRef {
  innhold: PortableText[];
  ref: string;
}

export default async function Page() {
  const brevmaler = await hentBrevmalerFraSanity();

  const portableTextMedRef: PortableTextMedRef[] = [];
  const brevMedInnhold = brevmaler[0].innhold.map((innhold) => {
    const delAvBrev: DelAvBrev = {
      type: innhold._type,
      brukEditor: false,
      id: innhold._id,
    };
    if (innhold._type === 'systeminnhold') {
      if (innhold.systemNokkel === 'fritekst') {
        delAvBrev.brukEditor = true;
      }
    }
    if (innhold._type === 'standardtekst') {
      delAvBrev.brukEditor = innhold.kanRedigeres;
      const portableText = innhold?.innhold.map((portableTextElement) => {
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
    <div>
      Brevmaler
      <div>
        <Heading size={'medium'}>{brevmaler[0].brevtittel}</Heading>
        <Brevbygger brevMedInnhold={brevMedInnhold} portableTextMedRef={portableTextMedRef} />
      </div>
    </div>
  );
}
