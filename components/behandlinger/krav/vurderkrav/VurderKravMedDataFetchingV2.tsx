import { hentKravGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderKravV2 } from 'components/behandlinger/krav/vurderkrav/VurderKravV2';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const VurderKravMedDataFetchingV2 = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const grunnlag = await hentKravGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const totalReadOnly = readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.VURDER_KRAV_KODE,
    totalReadOnly
  );

  return (
    <VurderKravV2
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      behandlingVersjon={behandlingVersjon}
      readOnly={totalReadOnly}
    />
  );
};
