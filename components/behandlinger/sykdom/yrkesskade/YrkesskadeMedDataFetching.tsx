import {
  hentMellomlagring,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { skalViseStegIkkePeriodisertGrunnlag, StegData } from 'lib/utils/steg';
import { Yrkesskade } from 'components/behandlinger/sykdom/yrkesskade/Yrkesskade';
import { OppgittYrkesskadeUtenRegistertreffInfo } from 'components/behandlinger/sykdom/yrkesskade/OppgittYrkesskadeUtenRegistertreffInfo';

interface Props {
  behandlingsreferanse: string;
  stegData: StegData;
}

export const YrkesskadeMedDataFetching = async ({ behandlingsreferanse, stegData }: Props) => {
  const yrkesskadeVurderingGrunnlag = await hentYrkesskadeVurderingGrunnlag(behandlingsreferanse);

  if (isError(yrkesskadeVurderingGrunnlag)) {
    return <ApiException apiResponses={[yrkesskadeVurderingGrunnlag]} />;
  }

  const grunnlag = yrkesskadeVurderingGrunnlag.data;
  const harVurdering = grunnlag.yrkesskadeVurdering != null;
  const harInnhentedeYrkesskader = (grunnlag.opplysninger?.innhentedeYrkesskader?.length ?? 0) > 0;
  const oppgittYrkesskadeISøknad = grunnlag.opplysninger.oppgittYrkesskadeISøknad;

  if (!skalViseStegIkkePeriodisertGrunnlag(stegData.avklaringsbehov, harVurdering) && !harInnhentedeYrkesskader) {
    if (oppgittYrkesskadeISøknad) {
      return <OppgittYrkesskadeUtenRegistertreffInfo grunnlag={grunnlag} />;
    }
    return null;
  }

  const totalReadOnly = stegData.readOnly || !grunnlag.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.YRKESSKADE_KODE,
    totalReadOnly,
    stegData.erIkkePåVent
  );

  return (
    <Yrkesskade
      grunnlag={grunnlag}
      readOnly={totalReadOnly}
      behandlingVersjon={stegData.behandlingVersjon}
      behandlingsreferanse={behandlingsreferanse}
      initialMellomlagretVurdering={initialMellomlagretVurdering}
    />
  );
};
