import { hentFlyt } from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  behandlingsreferanse: string;
}

const Page = async (props: { params: Promise<PageProps> }) => {
  const params = await props.params;
  const flyt = await hentFlyt(params.behandlingsreferanse);

  if (flyt === undefined) {
    return notFound();
  }

  redirect(`/${params.behandlingsreferanse}/${flyt.aktivGruppe}`);
};

export default Page;
