import {
  hentBehandling,
  hentBistandsbehovGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseStegForPeriodisertGrunnlag, StegData } from 'lib/utils/steg';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const BistandsbehovMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, behandling] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsreferanse),
    hentBehandling(behandlingsreferanse),
  ]);

  if (isError(grunnlag) || isError(behandling)) {
    return <ApiException apiResponses={[grunnlag, behandling]} />;
  }

  if (!skalViseStegForPeriodisertGrunnlag(stegData.avklaringsbehov, grunnlag.data)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  const vurderingsbehov = behandling.data.vurderingsbehovOgÅrsaker.flatMap(
    (behovOgÅrsak) => behovOgÅrsak.vurderingsbehov
  );

  const erRevurderingAvOvergangUføre = vurderingsbehov.some((behov) => behov.type === 'OVERGANG_UFORE');

  return (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      erRevurderingAvOvergangUføre={erRevurderingAvOvergangUføre}
    />
  );
};
