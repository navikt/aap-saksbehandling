import {
  hentInntektsBortfallGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { Inntektsbortfall } from './Inntektsbortfall';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const InntektsbortfallMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentInntektsBortfallGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Inntektsbortfall
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
