import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { hentMellomlagring, hentRefusjonGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { isDev } from 'lib/utils/environment';
import { RefusjonNyVising } from 'components/behandlinger/sykdom/refusjon/RefusjonNyVisning';

interface Props {
  behandlingsReferanse: string;
  behandlingVersjon: number;
  readOnly: boolean;
}

export const RefusjonMedDataFetching = async ({ behandlingsReferanse, behandlingVersjon, readOnly }: Props) => {
  const [refusjonGrunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentRefusjonGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.REFUSJON_KRAV_KODE),
  ]);

  if (isError(refusjonGrunnlag)) {
    return <ApiException apiResponses={[refusjonGrunnlag]} />;
  }

  return isDev() ? (
    <RefusjonNyVising
      grunnlag={refusjonGrunnlag.data}
      readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  ) : (
    <Refusjon
      grunnlag={refusjonGrunnlag.data}
      readOnly={readOnly || !refusjonGrunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
