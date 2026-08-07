import { hentMellomlagring, hentTrekkKlageGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

import { TrekkKlageVurdering } from 'components/behandlinger/klage/trekkklage/vurdering/TrekkKlageVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  visVentekort: boolean;
  typeBehandling: TypeBehandling;
}

export const TrekkKlageVurderingMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  visVentekort,
  typeBehandling,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentTrekkKlageGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.TREKK_KLAGE_KODE,
    readOnly,
    visVentekort
  );

  return (
    <TrekkKlageVurdering
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
