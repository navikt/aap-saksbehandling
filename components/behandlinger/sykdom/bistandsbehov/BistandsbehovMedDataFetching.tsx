import { hentBistandsbehovGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Bistandsbehov } from 'components/behandlinger/sykdom/bistandsbehov/Bistandsbehov';
import { TypeBehandling } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError, isSuccess } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const BistandsbehovMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const [grunnlag, mellomlagringForBistand] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_BISTANDSBEHOV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const mellomlagring = isSuccess(mellomlagringForBistand)
    ? mellomlagringForBistand.data.mellomlagretVurdering
    : undefined;

  return (
    <Bistandsbehov
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      mellomlagring={mellomlagring}
      typeBehandling={typeBehandling}
    />
  );
};
