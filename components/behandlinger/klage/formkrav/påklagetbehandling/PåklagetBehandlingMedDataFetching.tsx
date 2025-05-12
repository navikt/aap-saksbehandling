import { TypeBehandling } from '../../../../../lib/types/types';
import { PåklagetBehandling } from './PåklagetBehandling';
import { isError } from '../../../../../lib/utils/api';
import { ApiException } from '../../../../saksbehandling/apiexception/ApiException';
import { hentPåklagetBehandlingGrunnlag } from '../../../../../lib/services/saksbehandlingservice/saksbehandlingService';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
}

export const PåklagetBehandlingMedDataFetching = async ({
  behandlingVersjon,
  readOnly,
  typeBehandling,
  erAktivtSteg,
  behandlingsreferanse,
}: Props) => {
  const grunnlag = await hentPåklagetBehandlingGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <PåklagetBehandling
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
      grunnlag={grunnlag.data}
    />
  );
};
