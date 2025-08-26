import { FastsettBeregning } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregning';
import {
  hentBeregningstidspunktVurdering,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const FastsettBeregningMedDataFeching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentBeregningstidspunktVurdering(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <FastsettBeregning
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
