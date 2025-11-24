import { getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { SykdomsvurderingFormFields } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { SykdomsvurderingLøsningDto } from 'lib/types/types';

function mapForFørstegangsbehandling(
  data: SykdomsvurderingFormFields,
  erArbeidsevnenNedsatt: undefined | boolean,
  skalVurdereYrkesskade: boolean
): Pick<
  SykdomsvurderingLøsningDto,
  | 'erNedsettelseIArbeidsevneMerEnnHalvparten'
  | 'erSkadeSykdomEllerLyteVesentligdel'
  | 'erNedsettelseIArbeidsevneAvEnVissVarighet'
  | 'erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense'
  | 'yrkesskadeBegrunnelse'
> {
  const erNedsettelseIArbeidsevneMerEnnHalvparten = erArbeidsevnenNedsatt
    ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnHalvparten)
    : undefined;

  const yrkesskadeBegrunnelse =
    erNedsettelseIArbeidsevneMerEnnHalvparten === false ? data?.yrkesskadeBegrunnelse : undefined;

  const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense =
    skalVurdereYrkesskade && erNedsettelseIArbeidsevneMerEnnHalvparten === false
      ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)
      : undefined;

  const erSkadeSykdomEllerLyteVesentligdel =
    erNedsettelseIArbeidsevneMerEnnHalvparten ||
    (erNedsettelseIArbeidsevneMerEnnHalvparten === false &&
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense &&
      skalVurdereYrkesskade)
      ? getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel)
      : undefined;

  const erNedsettelseIArbeidsevneAvEnVissVarighet = erSkadeSykdomEllerLyteVesentligdel
    ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneAvEnVissVarighet)
    : undefined;

  return {
    erNedsettelseIArbeidsevneMerEnnHalvparten,
    erSkadeSykdomEllerLyteVesentligdel,
    erNedsettelseIArbeidsevneAvEnVissVarighet,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
    yrkesskadeBegrunnelse,
  };
}

function mapForRevurdering(
  data: SykdomsvurderingFormFields,
  erArbeidsevnenNedsatt: undefined | boolean,
  erÅrsakssammenhengYrkesskade: boolean
): Pick<
  SykdomsvurderingLøsningDto,
  | 'erNedsettelseIArbeidsevneMerEnnHalvparten'
  | 'erSkadeSykdomEllerLyteVesentligdel'
  | 'erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense'
> {
  const erNedsettelseIArbeidsevneMerEnnHalvparten =
    !erÅrsakssammenhengYrkesskade && erArbeidsevnenNedsatt
      ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnFørtiProsent)
      : undefined;

  const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense =
    erÅrsakssammenhengYrkesskade && erArbeidsevnenNedsatt
      ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)
      : undefined;

  const erSkadeSykdomEllerLyteVesentligdel = erNedsettelseIArbeidsevneMerEnnHalvparten
    ? getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel)
    : undefined;

  return {
    erNedsettelseIArbeidsevneMerEnnHalvparten,
    erSkadeSykdomEllerLyteVesentligdel,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
  };
}

function mapTilVurdering(
  data: SykdomsvurderingFormFields,
  skalVurdereYrkesskade: boolean,
  erÅrsakssammenhengYrkesskade: boolean,
  behandlingErFørstegangsbehandling: boolean,
  behandlingErRevurdering: boolean,
  behandlingErRevurderingAvFørstegangsbehandling: boolean
): SykdomsvurderingLøsningDto {
  // Denne overstyrer alle verdiene under. Hvis false skal alt nulles ut.
  const harSkadeSykdomEllerLyte = data.harSkadeSykdomEllerLyte === JaEllerNei.Ja;

  const kodeverk = harSkadeSykdomEllerLyte ? data?.kodeverk : undefined;
  const hoveddiagnose = harSkadeSykdomEllerLyte ? data?.hoveddiagnose?.value : undefined;
  const bidiagnoser = harSkadeSykdomEllerLyte ? data.bidiagnose?.map((diagnose) => diagnose.value) : undefined;

  // Denne overstyrer de under. Hvis false skal alt nulles ut.
  const erArbeidsevnenNedsatt = harSkadeSykdomEllerLyte
    ? getTrueFalseEllerUndefined(data.erArbeidsevnenNedsatt)
    : undefined;

  let nedsattArbeidsevneOgYrkesskade = {};
  if (harSkadeSykdomEllerLyte) {
    if (behandlingErFørstegangsbehandling || behandlingErRevurderingAvFørstegangsbehandling) {
      nedsattArbeidsevneOgYrkesskade = mapForFørstegangsbehandling(data, erArbeidsevnenNedsatt, skalVurdereYrkesskade);
    }
    if (behandlingErRevurdering && !behandlingErRevurderingAvFørstegangsbehandling) {
      nedsattArbeidsevneOgYrkesskade = mapForRevurdering(data, erArbeidsevnenNedsatt, erÅrsakssammenhengYrkesskade);
    }
  }

  return {
    ...nedsattArbeidsevneOgYrkesskade,
    begrunnelse: data.begrunnelse,
    fom: formaterDatoForBackend(parse(data.vurderingenGjelderFra, 'dd.MM.yyyy', new Date())),
    harSkadeSykdomEllerLyte,
    kodeverk,
    hoveddiagnose,
    bidiagnoser,
    erArbeidsevnenNedsatt,
    dokumenterBruktIVurdering: [],
  };
}

export default mapTilVurdering;
