import { hentKravGrunnlag, hentMellomlagringMedStatus } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { Behovstype } from 'lib/utils/form';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { VurderKrav } from 'components/behandlinger/krav/VurderKrav';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const VurderKravMedDataFetching = async ({ behandlingsreferanse, behandlingVersjon, readOnly }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentKravGrunnlag(behandlingsreferanse),
    hentMellomlagringMedStatus(behandlingsreferanse, Behovstype.VURDER_KRAV_KODE),
  ]);

  if (isError(grunnlag) || isError(initialMellomlagretVurdering)) {
    return <ApiException apiResponses={[grunnlag, initialMellomlagretVurdering]} />;
  }

  return (
    <VurderKrav
      grunnlag={grunnlag.data}
      initialMellomlagretVurdering={initialMellomlagretVurdering.data.mellomlagretVurdering}
      behandlingVersjon={behandlingVersjon}
      readOnly={
        readOnly
        // || !grunnlag.data.harTilgangTilÅSaksbehandle
      }
    />
  );
};
