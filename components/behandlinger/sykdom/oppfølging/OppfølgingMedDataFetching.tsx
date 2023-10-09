import { hentBistandsbehovGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { Oppfølging } from 'components/behandlinger/sykdom/oppfølging/Oppfølging';

interface Props {
  behandlingsReferanse: string;
}

export const OppfølgingMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentBistandsbehovGrunnlag(behandlingsReferanse, getToken(headers()));

  return <Oppfølging behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
