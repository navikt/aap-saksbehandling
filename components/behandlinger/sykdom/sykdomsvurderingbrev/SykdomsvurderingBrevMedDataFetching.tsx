import {
  hentForeløpigBehandlingsutfall,
  hentMellomlagring,
  hentSykdomsvurderingBrevGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { SykdomsvurderingBrev } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrev';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const SykdomsvurderingBrevMedDataFetching = async ({ behandlingsReferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering, foreløpigBehandlingsutfall] = await Promise.all([
    hentSykdomsvurderingBrevGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.SYKDOMSVURDERING_BREV_KODE),
    hentForeløpigBehandlingsutfall(behandlingsReferanse, stegData.stegType, 'VURDER_ALDER'),
  ]);

  if (isError(grunnlag) || isError(foreløpigBehandlingsutfall)) {
    return <ApiException apiResponses={[grunnlag, foreløpigBehandlingsutfall]} />;
  }

  return (
    <SykdomsvurderingBrev
      foreløpigBehandlingsutfall={foreløpigBehandlingsutfall.data}
      grunnlag={grunnlag.data}
      typeBehandling={stegData.typeBehandling}
      readOnly={stegData.readOnly || !grunnlag.data.kanSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
