import {
  hentMellomlagring,
  hentSykdomsvurderingBrevGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { isDev } from 'lib/utils/environment';
import { SykdomsvurderingBrevNyVisning } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrevNyVisning';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const SykdomsvurderingBrevMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSykdomsvurderingBrevGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.SYKDOMSVURDERING_BREV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return isDev() ? (
    <SykdomsvurderingBrevNyVisning
      grunnlag={grunnlag.data}
      typeBehandling={stegData.typeBehandling}
      readOnly={stegData.readOnly || !grunnlag.data.kanSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <SykdomsvurderingBrev
      grunnlag={grunnlag.data}
      typeBehandling={stegData.typeBehandling}
      readOnly={stegData.readOnly || !grunnlag.data.kanSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
