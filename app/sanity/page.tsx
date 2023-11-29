import { hentBrevmalerFraSanity } from 'lib/services/sanityservice/sanityservice';
import { BrevEditorMedSanity } from 'components/sanityplayground/BrevEditorMedSanity';
import { PortableText, deserialize } from 'lib/utils/sanity';
import { Heading } from '@navikt/ds-react/esm/typography';

interface DelAvBrev {
  type: string;
  brukEditor: boolean;
  id: string;
}

interface PortableTextMedRef {
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
    if (innhold._type === 'standardtekst') {
      delAvBrev.brukEditor = innhold.kanRedigeres;
      const portableText = innhold?.innhold.map((x) => {
        const children = x.children.map((child) => {
          // @ts-ignore
          if (child._type === 'systemVariabel') {
            return { ...child, text: 'Må innhentes fra systemet' };
          }

          return child;
        });

        return { ...x, children: children.filter((child) => child.text) };
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
        {brevMedInnhold.map((innhold, index) => {
          if (innhold.brukEditor) {
            return (
              <BrevEditorMedSanity
                initialValue={deserialize(portableTextMedRef.find((content) => content.ref === innhold.id)?.innhold)}
                key={index}
              />
            );
          }
          return <div key={index}>Ikke bruk editor</div>;
        })}
      </div>
    </div>
  );
}
