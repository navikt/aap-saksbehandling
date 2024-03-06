import { hentBehandling, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';

import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { saksId: string; behandlingsReferanse: string } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse);
  const flyt = await hentFlyt(params.behandlingsReferanse);

  if (behandling === undefined || flyt === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  redirect(`/sak/${params.saksId}/${behandling.referanse}/${flyt.aktivGruppe}`);
};

export default Page;
