import { ForeslåVedtakVedtakslengde } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengde';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentForeslåVedtakVedtakslengdeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readonly: boolean;
}

export const ForeslåVedtakVedtakslengdeMedDataFetching = async ({
  behandlingVersjon,
  behandlingsreferanse,
  readonly,
}: Props) => {
  if (!unleashService.isEnabled('ForeslaaVedtakVedtakslengde')) {
    return null;
  }

  const grunnlag = await hentForeslåVedtakVedtakslengdeGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (grunnlag.data.perioder == null) {
    return null;
  }

  return (
    <ForeslåVedtakVedtakslengde
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
    />
  );
};
