import { hentMellomlagring, hentOvergangUforeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { StegData } from 'lib/utils/steg';
import { OvergangUforePeriodisert } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const OvergangUforeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const [grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentOvergangUforeGrunnlag(behandlingsreferanse),
    hentMellomlagring(behandlingsreferanse, Behovstype.OVERGANG_UFORE),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  return (
    <OvergangUforePeriodisert
      grunnlag={grunnlag.data}
      readOnly={stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
