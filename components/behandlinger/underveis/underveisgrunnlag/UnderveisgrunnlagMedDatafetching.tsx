import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { logWarning } from 'lib/serverutlis/logger';
import { hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { UnderveisGrunnlag } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
}

export const UnderveisgrunnlagMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  let grunnlag: UnderveisGrunnlag[] = [];
  try {
    grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);
  } catch (err) {
    logWarning('hentUnderveisgrunnlag', err);
  }
  return <Underveisgrunnlag grunnlag={grunnlag} />;
};
