import { StegKolonne } from 'components/postmottak/stegkolonne/StegKolonne';
import { StegGruppe } from 'lib/types/postmottakTypes';

interface PageProps {
  aktivGruppe: StegGruppe;
  behandlingsreferanse: string;
}

const Page = async (props: { params: Promise<PageProps> }) => {
  const params = await props.params;
  return <StegKolonne aktivGruppe={params.aktivGruppe} behandlingsreferanse={params.behandlingsreferanse} />;
};

export default Page;
