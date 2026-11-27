import { Beslutter } from 'components/behandlinger/vedtak/beslutter/Beslutter';
import { hentFatteVedtakGrunnlang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  readOnly: boolean;
  behandlingsversjon: number;
}

export const BeslutterMedDataFetching = async ({ behandlingsreferanse, readOnly, behandlingsversjon }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <Beslutter grunnlag={grunnlag.data} readOnly={readOnly} behandlingsversjon={behandlingsversjon} />;
};
