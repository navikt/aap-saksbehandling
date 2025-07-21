'use server';

import { FatteVedtak } from 'components/behandlinger/fattevedtak/fattevedtak/FatteVedtak';
import { hentFatteVedtakGrunnlang } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
}

export const FatteVedtakMedDataFetching = async ({ behandlingsreferanse }: Props) => {
  const grunnlag = await hentFatteVedtakGrunnlang(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <FatteVedtak grunnlag={grunnlag.data} />;
};
