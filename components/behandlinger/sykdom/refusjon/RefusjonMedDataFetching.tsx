import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const refusjonGrunnlag = await hentRefusjonGrunnlag(behandlingsReferanse);
  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  return (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
