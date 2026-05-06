import { ForeslåVedtak } from 'components/behandlinger/vedtak/foreslåvedtak/ForeslåVedtak';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentForeslåVedtakGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readonly: boolean;
}

export const ForeslåVedtakMedDataFetching = async ({ behandlingVersjon, behandlingsreferanse, readonly }: Props) => {
  const grunnlag = await hentForeslåVedtakGrunnlag(behandlingsreferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <ForeslåVedtak
      behandlingVersjon={behandlingVersjon}
      readOnly={readonly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
    />
  );
};
