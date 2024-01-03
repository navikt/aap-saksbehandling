import { loadQuery } from 'lib/services/sanityservice/store';
import { Brevmal } from 'lib/utils/sanity';

export default async function Page({ params }: { params: { id: string } }) {
  const { data } = await loadQuery<Brevmal>(`*[_id == "${params.id}"][0]`);
  return (
    <div>
      <h1>{data.brevtittel}</h1>
    </div>
  );
}
