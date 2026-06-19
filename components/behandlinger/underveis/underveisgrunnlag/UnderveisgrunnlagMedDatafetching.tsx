import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import { hentUnderveisGrunnlagMedDiff } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const UnderveisgrunnlagMedDataFetching = async ({
  behandlingsreferanse,
  readOnly,
  behandlingVersjon,
}: Props) => {
  const underveisGrunnlagMedDiff = await hentUnderveisGrunnlagMedDiff(behandlingsreferanse);
  if (isError(underveisGrunnlagMedDiff)) {
    return <ApiException apiResponses={[underveisGrunnlagMedDiff]} />;
  }

  return (
    <Underveisgrunnlag
      readOnly={readOnly}
      behandlingVersjon={behandlingVersjon}
      grunnlagMedDiff={underveisGrunnlagMedDiff.data}
    />
  );
};
