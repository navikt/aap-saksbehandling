import { SamordningAndreStatligeYtelser } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';
import {
  hentMellomlagring,
  hentSamordningAndreStatligeYtelseGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}
export const SamordningAndreStatligeYtelserMedDatafetching = async ({
  behandlingVersjon,
  readOnly,
  behandlingsreferanse,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSamordningAndreStatligeYtelseGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <SamordningAndreStatligeYtelser
      grunnlag={grunnlag.data}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
