import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { JaEllerNei } from 'lib/utils/form';
import { Sykdomvurdering } from 'lib/types/types';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { isAfter } from 'date-fns';
import { ValuePair } from 'components/form/FormField';

export function skalVurdereVissVarighetSjekk(
  valgtFraDato: string | Date | undefined,
  rettighetsperiopdeStartdato: Date
) {
  const valgtDato = parseDatoFraDatePicker(valgtFraDato);
  return valgtDato != null ? !isAfter(valgtDato, rettighetsperiopdeStartdato) : true;
}
export function erNyVurderingOppfylt(
  vurdering: Sykdomsvurdering,
  rettighetsperiodeStartDato: Date,
  skalVurdereYrkesskade: boolean
): boolean | undefined {
  if (
    vurdering.harSkadeSykdomEllerLyte === JaEllerNei.Nei ||
    vurdering.erArbeidsevnenNedsatt === JaEllerNei.Nei ||
    (!skalVurdereYrkesskade && vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Nei) ||
    vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneMerEnnFørtiProsent === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Nei
  ) {
    return false;
  }

  if (vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Ja) {
    return true;
  }

  if (
    !skalVurdereVissVarighetSjekk(vurdering.fraDato, rettighetsperiodeStartDato) &&
    vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja
  ) {
    return true;
  }
}

export function erTidligereVurderingOppfylt(vurdering: Sykdomvurdering): boolean | undefined {
  if (
    vurdering.harSkadeSykdomEllerLyte === false ||
    vurdering.erArbeidsevnenNedsatt === false ||
    vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === false ||
    vurdering.erSkadeSykdomEllerLyteVesentligdel === false ||
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === false ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === false
  ) {
    return false;
  }

  if (
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === true ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === true
  ) {
    return true;
  }

  if (
    vurdering.erSkadeSykdomEllerLyteVesentligdel === true &&
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet == null
  ) {
    return true;
  }
}

export function emptySykdomsvurdering(diagnoser: {
  kodeverk?: string;
  hoveddiagnose?: ValuePair | null;
  bidiagnose?: ValuePair[] | null;
}): Sykdomsvurdering {
  return {
    fraDato: '',
    begrunnelse: '',
    vurderingenGjelderFra: '',
    harSkadeSykdomEllerLyte: '',
    erArbeidsevnenNedsatt: undefined,
    erNedsettelseIArbeidsevneMerEnnHalvparten: undefined,
    erSkadeSykdomEllerLyteVesentligdel: undefined,
    kodeverk: diagnoser.kodeverk,
    hoveddiagnose: diagnoser.hoveddiagnose,
    bidiagnose: diagnoser.bidiagnose,
    erNedsettelseIArbeidsevneAvEnVissVarighet: undefined,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: undefined,
    erNedsettelseIArbeidsevneMerEnnFørtiProsent: undefined,
    yrkesskadeBegrunnelse: '',
    erNyVurdering: true,
    behøverVurdering: false,
  };
}
