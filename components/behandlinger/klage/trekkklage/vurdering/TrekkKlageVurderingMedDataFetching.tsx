import { TypeBehandling } from 'lib/types/types';
import { TrekkKlageVurdering } from 'components/behandlinger/klage/trekkklage/vurdering/TrekkKlageVurdering';
import { hentTrekkKlageGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

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
  const grunnlag = await hentTrekkKlageGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <TrekkKlageVurdering
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      grunnlag={grunnlag.data}
    />
  );
};
