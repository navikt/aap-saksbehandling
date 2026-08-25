import {
  hentBehandling,
  hentKravGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderKrav } from 'components/behandlinger/krav/vurderkrav/VurderKrav';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  erIkkePåVent: boolean;
}

export const VurderKravMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
  erIkkePåVent,
}: Props) => {
  const [grunnlag, behandling] = await Promise.all([
    hentKravGrunnlag(behandlingsreferanse),
    hentBehandling(behandlingsreferanse),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_KRAV_KODE,
    totalReadOnly,
    erIkkePåVent
  );

  const vurderingsbehov =
    behandling.type === 'SUCCESS'
      ? behandling.data.vurderingsbehovOgÅrsaker.flatMap((behovOgÅrsak) => behovOgÅrsak.vurderingsbehov)
      : [];
  const harMigreringsbehov = vurderingsbehov.some((behov) => behov.type === 'MIGRERING_FRA_ARENA');

  return (
    <VurderKrav
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
      harMigreringsbehov={harMigreringsbehov}
    />
  );
};
