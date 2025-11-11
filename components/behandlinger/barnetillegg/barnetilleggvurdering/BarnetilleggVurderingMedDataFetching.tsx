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
  const [grunnlag, behandlingPersoninfo, initialMellomlagretVurdering] = await Promise.all([
    hentBarnetilleggGrunnlag(behandlingsreferanse),
    hentBehandlingPersoninfo(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_BARNETILLEGG_KODE),
  ]);

  if (isError(grunnlag) || isError(behandlingPersoninfo)) {
    return <ApiException apiResponses={[grunnlag, behandlingPersoninfo]} />;
  }

  return (
    <BarnetilleggVurdering
      grunnlag={grunnlag.data}
      behandlingsversjon={stegData.behandlingVersjon}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingPersonInfo={behandlingPersoninfo.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
