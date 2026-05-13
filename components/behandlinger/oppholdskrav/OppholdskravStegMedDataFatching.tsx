'use server';

import { OppholdskravSteg } from 'components/behandlinger/oppholdskrav/OppholdskravSteg';
import { hentMellomlagring, hentOppholdskravGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

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

  const mellomlagring = await hentMellomlagring(behandlingsreferanse, Behovstype.OPPHOLDSKRAV_KODE, readOnly);

  return (
    <OppholdskravSteg
      grunnlag={grunnlag.data}
      initialMellomlagring={mellomlagring}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
    />
  );
};
