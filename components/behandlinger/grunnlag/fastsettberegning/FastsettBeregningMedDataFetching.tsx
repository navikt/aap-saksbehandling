import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import {
  hentBeregningstidspunktVurdering,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const FastsettBeregningMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentBeregningstidspunktVurdering(behandlingsreferanse);
  const visAarsakDropdowns = unleashService.isEnabled('BeregningstidspunktAarsak');

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, !!grunnlag.data.vurdering)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
    totalReadOnly
  );

  return (
    <FastsettBeregning
      readOnly={totalReadOnly}
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      visAarsakDropdowns={visAarsakDropdowns}
    />
  );
};
