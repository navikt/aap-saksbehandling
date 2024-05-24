import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { hentSykepengerErstatningGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SykepengeerstatningMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentSykepengerErstatningGrunnlag(behandlingsReferanse);

  return <Sykepengeerstatning grunnlag={grunnlag} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />;
};
