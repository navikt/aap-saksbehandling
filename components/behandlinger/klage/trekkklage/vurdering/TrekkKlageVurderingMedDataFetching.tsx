import { TypeBehandling } from 'lib/types/types';
import { TrekkKlageVurdering } from 'components/behandlinger/klage/trekkklage/vurdering/TrekkKlageVurdering';
import { hentMellomlagring, hentTrekkKlageGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const TrekkKlageVurderingMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  typeBehandling,
  behandlingsreferanse,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentTrekkKlageGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.TREKK_KLAGE_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

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
