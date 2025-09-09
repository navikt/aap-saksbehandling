import { hentBistandsbehovGrunnlag, hentMellomlagring } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { Bistandsbehovutenovergang } from 'components/behandlinger/sykdom/bistandsbehovutenovergang/Bistandsbehovutenovergang';
import { StegData } from 'lib/utils/steg';

interface Props {
  behandlingsReferanse: string;
  stegData: StegData;
}

export const BistandsbehovutenovergangMedDataFetching = async ({ stegData, behandlingsReferanse }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentBistandsbehovGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_BISTANDSBEHOV_KODE),
  ]);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <Bistandsbehovutenovergang
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      typeBehandling={stegData.typeBehandling}
    />
  );
};
