import { client } from 'sanity/client';
import { Heading } from '@navikt/ds-react/esm/typography';

interface Brevmal {
  name: string;
  content: string;
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
            <p>{brevmal.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
