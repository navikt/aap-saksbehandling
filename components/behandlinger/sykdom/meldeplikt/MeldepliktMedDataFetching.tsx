import { hentUnntakMeldepliktGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getToken } from 'lib/auth/authentication';
import { headers } from 'next/headers';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';

interface Props {
  behandlingsReferanse: string;
}

export const MeldepliktMedDataFetching = async ({ behandlingsReferanse }: Props) => {
  const grunnlag = await hentUnntakMeldepliktGrunnlag(behandlingsReferanse, getToken(headers()));

  return <Meldeplikt behandlingsReferanse={behandlingsReferanse} grunnlag={grunnlag} />;
};
