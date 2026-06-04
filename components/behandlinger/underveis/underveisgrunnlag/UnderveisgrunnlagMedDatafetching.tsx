import { Underveisgrunnlag } from 'components/behandlinger/underveis/underveisgrunnlag/Underveisgrunnlag';
import {
  hentUnderveisGrunnlag,
  hentUnderveisGrunnlagMedDiff,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { unleashService } from 'lib/services/unleash/unleashService';

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
  const underveisMedDiffToggle = unleashService.isEnabled('UnderveisMedDiff');

  if (underveisMedDiffToggle) {
    const underveisGrunnlagMedDiff = await hentUnderveisGrunnlagMedDiff(behandlingsreferanse);
    if (isError(underveisGrunnlagMedDiff)) {
      return <ApiException apiResponses={[underveisGrunnlagMedDiff]} />;
    }

    return (
      <Underveisgrunnlag
        readOnly={readOnly}
        behandlingVersjon={behandlingVersjon}
        grunnlag={[]}
        grunnlagMedDiff={underveisGrunnlagMedDiff.data}
        visMedDiff={true}
      />
    );
  } else {
    const [grunnlag] = await Promise.all([hentUnderveisGrunnlag(behandlingsreferanse)]);

    if (isError(grunnlag)) {
      return <ApiException apiResponses={[grunnlag]} />;
    }

    return (
      <Underveisgrunnlag
        readOnly={readOnly}
        behandlingVersjon={behandlingVersjon}
        grunnlag={grunnlag.data}
        grunnlagMedDiff={{ perioder: [] }}
        visMedDiff={false}
      />
    );
  }
};
