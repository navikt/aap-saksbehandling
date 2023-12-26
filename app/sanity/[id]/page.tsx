import { loadQuery } from 'lib/services/sanityservice/store';

export default async function Page({ params }: { params: { id: string } }) {
  const { data } = await loadQuery(`*[_id == "${params.id}"][0]`);
  return (
    <div>
      <h1>{data.brevtittel}</h1>
    </div>
  );
}
