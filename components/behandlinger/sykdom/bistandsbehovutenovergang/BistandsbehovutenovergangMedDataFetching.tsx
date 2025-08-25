import { hentBistandsbehovGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { TypeBehandling } from 'lib/types/types';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError, isSuccess } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { Bistandsbehovutenovergang } from 'components/behandlinger/sykdom/bistandsbehovutenovergang/Bistandsbehovutenovergang';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
}

export const BistandsbehovutenovergangMedDataFetching = async ({
  behandlingsReferanse,
  behandlingVersjon,
  readOnly,
  typeBehandling,
}: Props) => {
  const [grunnlag] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_BISTANDSBEHOV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Bistandsbehovutenovergang
      grunnlag={grunnlag.data}
      readOnly={readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      typeBehandling={typeBehandling}
    />
  );
};
