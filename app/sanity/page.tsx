import { hentBrevmalerFraSanity } from 'lib/services/sanityservice/sanityservice';
import { Heading } from '@navikt/ds-react/esm/typography';
import { BrevEditorMedSanity } from 'components/sanityplayground/BrevEditorMedSanity';
import { deserialize } from 'lib/utils/sanity';

export default async function Page() {
  const brevmaler = await hentBrevmalerFraSanity();

  const transformedObject = brevmaler.map((item) => ({
    brevtype: item.brevtype,
    innhold: [...(item.standardtekster || []), ...(item.vilkarsvurderinger || [])].flatMap((tekst) => tekst.innhold),
  }));

  return (
    <div>
      Brevmaler
      <div>
        {transformedObject.map((brevmal, index) => (
          <div key={index}>
            <Heading size={'medium'}>{brevmal.brevtype}</Heading>
            <BrevEditorMedSanity initialValue={deserialize(brevmal.innhold)} />
          </div>
        ))}
      </div>
    </div>
  );
}
