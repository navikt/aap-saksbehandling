import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
}

export const UnderveisgrunnlagMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);
  return <Underveisgrunnlag grunnlag={grunnlag} />;
};
