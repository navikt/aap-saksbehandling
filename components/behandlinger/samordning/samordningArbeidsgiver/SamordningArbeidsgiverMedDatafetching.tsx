import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import {
  hentMellomlagring,
  hentSamordningArbeidsgiverGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SamordningArbeidsgiver } from 'components/behandlinger/samordning/samordningArbeidsgiver/SamordningArbeidsgiver';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningArbeidsgiverMedDatafetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingsreferanse,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningArbeidsgiverGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_ARBEIDSGIVER),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningArbeidsgiver
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
