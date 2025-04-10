import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import {
  hentBarnetilleggGrunnlag,
  hentBehandlingPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

type Props = {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  harAvklaringsbehov: boolean;
  readOnly: boolean;
};

export const BarnetilleggVurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
  harAvklaringsbehov,
}: Props) => {
  const grunnlag = await hentBarnetilleggGrunnlag(behandlingsreferanse);
  const behandlingPersoninfo = await hentBehandlingPersoninfo(behandlingsreferanse);
  if (isError(grunnlag) || isError(behandlingPersoninfo)) {
    return <ApiException apiResponses={[grunnlag, behandlingPersoninfo]} />;
  }

  return (
    <BarnetilleggVurdering
      harAvklaringsbehov={harAvklaringsbehov}
      grunnlag={grunnlag.data}
      behandlingsversjon={behandlingsversjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingPersonInfo={behandlingPersoninfo.data}
    />
  );
};
