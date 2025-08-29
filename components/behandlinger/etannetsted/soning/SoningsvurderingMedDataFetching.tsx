import { Soningsvurdering } from './Soningsvurdering';
import { hentMellomlagring, hentSoningsvurdering } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsreferanse: string;
  behandlingsversjon: number;
  readOnly: boolean;
}

export const SoningsvurderingMedDataFetching = async ({
  behandlingsreferanse,
  behandlingsversjon,
  readOnly,
}: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentSoningsvurdering(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.AVKLAR_SONINGSFORRHOLD),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    grunnlag.data.soningsforhold.length > 0 && (
      <Soningsvurdering
        behandlingsversjon={behandlingsversjon}
        grunnlag={grunnlag.data}
        readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      />
    )
  );
};
