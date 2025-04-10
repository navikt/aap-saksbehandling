import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import { hentBeregningstidspunktVurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentBeregningstidspunktVurdering(behandlingsReferanse);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettBeregning
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
    />
  );
};
