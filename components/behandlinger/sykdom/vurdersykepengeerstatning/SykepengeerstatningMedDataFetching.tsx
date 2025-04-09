import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { hentSykepengerErstatningGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

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
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Sykepengeerstatning
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
