import { TrekkSøknad } from 'components/behandlinger/søknad/trekksøknad/TrekkSøknad';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentTrukketSøknad } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingVersjon: number;
}

export const TrekkSøknadMedDatafetching = async ({ behandlingsreferanse, readOnly, behandlingVersjon }: Props) => {
  const trukketSøknadGrunnlag = await hentTrukketSøknad(behandlingsreferanse);
  if (isError(trukketSøknadGrunnlag)) {
    return <ApiException apiResponses={[trukketSøknadGrunnlag]} />;
  }

  return (
    <TrekkSøknad grunnlag={trukketSøknadGrunnlag.data} readOnly={readOnly} behandlingVersjon={behandlingVersjon} />
  );
};
