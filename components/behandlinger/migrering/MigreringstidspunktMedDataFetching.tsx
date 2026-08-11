import {
  hentMigreringsdatoGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';

import { MigreringstidspunktVurdering } from 'components/behandlinger/migrering/MigreringstidspunktVurdering';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

type Props = {
  behandlingsreferanse: string;
  stegData: StegData;
};

export const MigreringstidspunktMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentMigreringsdatoGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_MIGRERINGSDATO,
    totalReadOnly
  );

  return (
    <MigreringstidspunktVurdering
      behandlingsversjon={stegData.behandlingVersjon}
      readOnly={totalReadOnly}
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
