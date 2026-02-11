import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { hentRettighetsdata, hentUnderveisGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError, isSuccess } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
  saksnummer: string;
}

export const UnderveisgrunnlagMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
  saksnummer,
}: Props) => {
  const grunnlag = await hentUnderveisGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const rettighetsdataRespons = await hentRettighetsdata(saksnummer);

  return (
    <Underveisgrunnlag
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      grunnlag={grunnlag.data}
      rettighetsdata={isSuccess(rettighetsdataRespons) ? rettighetsdataRespons.data : []}
    />
  );
};
