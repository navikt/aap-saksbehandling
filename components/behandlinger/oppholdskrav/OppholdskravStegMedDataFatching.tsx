'use server';

import { OppholdskravSteg } from 'components/behandlinger/oppholdskrav/OppholdskravSteg';
import { hentOppholdskravGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const OppholdskravStegMedDataFatching = async ({ behandlingVersjon, behandlingsreferanse, readOnly }: Props) => {
  const grunnlag = await hentOppholdskravGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return <OppholdskravSteg grunnlag={grunnlag.data} behandlingVersjon={behandlingVersjon} readOnly={readOnly} />;
};
