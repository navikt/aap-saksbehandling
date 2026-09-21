import { hentMellomlagring, hentOvergangUforeGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseStegForPeriodisertGrunnlag, StegData } from 'lib/utils/steg';
import { OvergangUforePeriodisert } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const OvergangUforeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const grunnlag = await hentOvergangUforeGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const skalStegVurderes = skalViseStegForPeriodisertGrunnlag(stegData.avklaringsbehov, grunnlag.data);
  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle || !skalStegVurderes;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.OVERGANG_UFORE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <OvergangUforePeriodisert
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
      skalStegVurderes={skalStegVurderes}
    />
  );
};
