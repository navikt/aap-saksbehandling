import { hentBrevmalerFraSanity } from 'lib/services/sanityservice/sanityservice';
import { BrevEditorMedSanity } from 'components/sanityplayground/BrevEditorMedSanity';
import { deserialize } from 'lib/utils/sanity';
import { Heading } from '@navikt/ds-react/esm/typography';

export default async function Page() {
  const brevmaler = await hentBrevmalerFraSanity();

  const brevinnhold = brevmaler[0].innhold.map((i) => {
    const innhold = i.innhold.map((x) => {
      const children = x.children.map((child) => {
        // @ts-ignore
        if (child._type === 'systemVariabel') {
          return { ...child, text: 'Må innhentes fra systemet' };
        }

        return child;
      });

      return { ...x, children: children.filter((child) => child.text) };
    });

    return { ...i, innhold };
  });

  return (
    <div>
      Brevmaler
      <div>
        <Heading size={'medium'}>{brevmaler[0].brevtittel}</Heading>
        {brevinnhold.map((innhold, index) => (
          <BrevEditorMedSanity initialValue={deserialize(innhold.innhold)} key={index} />
        ))}
      </div>
    </div>
  );
}
