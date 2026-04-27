import {
  hentMellomlagring,
  hentOvergangArbeidGrunnlag,
  hentOvergangUforeGrunnlag,
  hentSykdomsGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
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
  const [grunnlag, sykdomGrunnlag, overgangArbeidGrunnlag] = await Promise.all([
    hentOvergangUforeGrunnlag(behandlingsreferanse),
    hentSykdomsGrunnlag(behandlingsreferanse),
    hentOvergangArbeidGrunnlag(behandlingsreferanse),
  ]);
  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  if (isError(sykdomGrunnlag)) {
    return <ApiException apiResponses={[sykdomGrunnlag]} />;
  }

  if (isError(overgangArbeidGrunnlag)) {
    return <ApiException apiResponses={[overgangArbeidGrunnlag]} />;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.OVERGANG_UFORE,
    totalReadOnly
  );

  return (
    <OvergangUforePeriodisert
      grunnlag={grunnlag.data}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
