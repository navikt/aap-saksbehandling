import { client } from 'sanity/client';
import { Heading } from '@navikt/ds-react/esm/typography';
import { PortableText } from '@portabletext/react';
import { TypedObject } from '@sanity/types';

interface Brevmal {
  name: string;
  content: TypedObject[];
}

export const SanityPlayground = async () => {
  const queryResult = await client.fetch<Array<Brevmal>>('*[_type=="brev"]{content, name}');

  return (
    <div>
      Brevmaler
      <div>
        {queryResult.map((brevmal, index) => (
          <div key={index}>
            <Heading size={'medium'}>{brevmal.name}</Heading>
            <p>{JSON.stringify(brevmal, null, 4)}</p>
            <PortableText value={brevmal.content} />
          </div>
        ))}
      </div>
    </div>
  );
};
