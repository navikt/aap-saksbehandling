import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import {
  hentBarnetilleggGrunnlag,
  hentBehandlingPersoninfo,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

type Props = {
  behandlingsreferanse: string;
  stegData: StegData;
};

export const BarnetilleggVurderingMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, behandlingPersoninfo] = await Promise.all([
    hentBarnetilleggGrunnlag(behandlingsreferanse),
    hentBehandlingPersoninfo(behandlingsreferanse),
  ]);

  if (isError(grunnlag) || isError(behandlingPersoninfo)) {
    return <ApiException apiResponses={[grunnlag, behandlingPersoninfo]} />;
  }
  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_BARNETILLEGG_KODE,
    totalReadOnly
  );

  return (
    <BarnetilleggVurdering
      grunnlag={grunnlag.data}
      behandlingsversjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      behandlingPersonInfo={behandlingPersoninfo.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
