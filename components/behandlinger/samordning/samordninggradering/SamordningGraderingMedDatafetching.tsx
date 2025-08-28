import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import {
  hentMellomlagring,
  hentSamordningGraderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const SamordningGraderingMedDatafetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  readOnly,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningGraderingGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_GRADERING),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningGradering
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
