import { BehandlendeEnhet } from './BehandlendeEnhet';
import { TypeBehandling } from '../../../../../lib/types/types';
import { hentBehandlendeEnhetGrunnlag } from '../../../../../lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from '../../../../../lib/utils/api';
import { ApiException } from '../../../../saksbehandling/apiexception/ApiException';

export const BehandlendeEnhetMedDataFetching = async ({
  behandlingsreferanse,
  behandlingVersjon,
  typeBehandling,
  erAktivtSteg,
  readOnly,
}: {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  erAktivtSteg: boolean;
  readOnly: boolean;
}) => {
  const grunnlag = await hentBehandlendeEnhetGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <BehandlendeEnhet
      grunnlag={grunnlag.data}
      typeBehandling={typeBehandling}
      erAktivtSteg={erAktivtSteg}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
    />
  );
};
