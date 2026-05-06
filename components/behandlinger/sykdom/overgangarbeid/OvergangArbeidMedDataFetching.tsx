import {
  hentMellomlagring,
  hentOvergangArbeidGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseSteg, StegData } from 'lib/utils/steg';
import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const OvergangArbeidMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentOvergangArbeidGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const harTidligereVurderinger =
    grunnlag.data.sisteVedtatteVurderinger != null && grunnlag.data.sisteVedtatteVurderinger.length > 0;

  if (!skalViseSteg(stegData, harTidligereVurderinger)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.OVERGANG_ARBEID,
    totalReadOnly
  );

  return (
    <OvergangArbeid
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
