import {
  hentMellomlagring,
  hentSamordningUføreGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { SamordningUføre } from 'components/behandlinger/samordning/samordninguføre/SamordningUføre';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}
export const SamordningUføreMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentSamordningUføreGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SAMORDNING_UFORE,
    totalReadOnly
  );

  return (
    <SamordningUføre
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
