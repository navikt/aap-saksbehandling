import { hentMellomlagring, hentSykestipendGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData, skalViseSteg } from 'lib/utils/steg';

import { SykestipendVurdering } from 'components/behandlinger/samordning/sykestipend/SykestipendVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const SykestipendMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentSykestipendGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (!skalViseSteg(stegData, grunnlag.data.gjeldendeVurdering != null)) {
    return null;
  }

  const totalReadOnly = stegData.readOnly;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SAMORDNING_SYKESTIPEND_KODE,
    totalReadOnly,
    stegData.visVentekort
  );

  return (
    <SykestipendVurdering
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
