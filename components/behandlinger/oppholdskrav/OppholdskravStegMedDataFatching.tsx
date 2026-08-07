'use server';

import { hentMellomlagring, hentOppholdskravGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { OppholdskravSteg } from 'components/behandlinger/oppholdskrav/OppholdskravSteg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
}

export const OppholdskravStegMedDataFatching = async ({
  behandlingVersjon,
  behandlingsreferanse,
  readOnly,
  visVentekort,
}: Props) => {
  const grunnlag = await hentOppholdskravGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const mellomlagring = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.OPPHOLDSKRAV_KODE,
    readOnly,
    visVentekort
  );

  return (
    <OppholdskravSteg
      grunnlag={grunnlag.data}
      initialMellomlagring={mellomlagring}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
    />
  );
};
