import { getToken } from 'lib/auth/authentication';
import { hentBehandling } from '../../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { headers } from 'next/headers';

import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { saksId: string; behandlingsReferanse: string } }) => {
  const behandling = await hentBehandling(params.behandlingsReferanse, getToken(headers()));

  if (behandling === undefined) {
    return <div>Behandling ikke funnet</div>;
  }

  redirect(`/sak/${params.saksId}/${behandling.referanse}/${behandling.aktivtSteg}`);
};

export default Page;
