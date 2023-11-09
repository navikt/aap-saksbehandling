import { client } from 'sanity/client';

export const SanityPlayground = async () => {
  const queryResult = await client.fetch<Array<any>>('*[_type=="brev"]{content}');
  return (
    <div>
      Playground
      <div>
        {queryResult.map((r) => (
          <span key={r.content}>{r.content}</span>
        ))}
      </div>
    </div>
  );
};
