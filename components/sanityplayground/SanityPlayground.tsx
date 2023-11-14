import { client } from 'sanity/client';
import { Heading } from '@navikt/ds-react/esm/typography';

import { Breveditor } from 'components/breveditor/Breveditor';
import { deserialize, PortableText } from 'lib/utils/sanity';

interface Vilkårsvurdering {
  tittel: string;
  innhold: Array<PortableText>;
}

export const SanityPlayground = async () => {
  const queryResult = await client.fetch<Array<Vilkårsvurdering>>('*[_type == "vilkarsvurdering"]{innhold, tittel}');

  return (
    <div>
      Brevmaler
      <div>
        {queryResult.map((brevmal, index) => (
          <div key={index}>
            <Heading size={'medium'}>{brevmal.tittel}</Heading>
            <p>{JSON.stringify(brevmal, null, 4)}</p>
            <Breveditor initialValue={deserialize(brevmal.innhold)} />
          </div>
        ))}
      </div>
    </div>
  );
};
