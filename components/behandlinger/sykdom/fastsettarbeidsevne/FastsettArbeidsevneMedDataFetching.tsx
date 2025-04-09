import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { hentFastsettArbeidsevneGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const FastsettArbeidsevneMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const grunnlag = await hentFastsettArbeidsevneGrunnlag(behandlingsReferanse);
  if (grunnlag.type === 'ERROR') {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettArbeidsevne
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
