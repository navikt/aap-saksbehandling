import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import {
  hentMellomlagring,
  hentSamordningArbeidsgiverGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { SamordningArbeidsgiver } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}
export const SamordningArbeidsgiverMedDatafetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentSamordningArbeidsgiverGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER,
    totalReadOnly
  );

  return (
    <SamordningArbeidsgiver
      grunnlag={grunnlag.data}
      behandlingVersjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
