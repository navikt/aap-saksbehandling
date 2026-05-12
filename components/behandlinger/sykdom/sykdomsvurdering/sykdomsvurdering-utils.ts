import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { JaEllerNei } from 'lib/utils/form';
import { Sykdomvurdering } from 'lib/types/types';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { isAfter } from 'date-fns';
import { ValuePair } from 'components/form/FormField';

/**
 * Dette er en litt uheldig "hack" som har blitt brukt for å utlede om viss varighet skal vurderes.
 * Må beholdes en liten stund til inntil vi klarer å utlede informasjonen vi faktisk trenger.
 *
 * Det vi egentlig skal sjekke er om forrige vurdering/behandling var oppfylt. Hvis ja, skal denne gjelde.
 **/
export function vurderingFraDatoErSammeSomRettighetsperiodeStart(
  valgtFraDato: string | Date | undefined,
  rettighetsperiopdeStartdato: Date
) {
  const valgtDato = parseDatoFraDatePicker(valgtFraDato);

  if (valgtDato) {
    return !isAfter(valgtDato, rettighetsperiopdeStartdato);
  } else {
    return false;
  }
}
export function erNyVurderingOppfylt(
  vurdering: Sykdomsvurdering,
  skalVurdereYrkesskade: boolean,
  sykdomUtenVissVarighetToggle: boolean
): boolean | undefined {
  if (sykdomUtenVissVarighetToggle) {
    if (
      vurdering.harSkadeSykdomEllerLyte === JaEllerNei.Nei ||
      vurdering.harNedsattArbeidsevne === 'NEI' ||
      (!skalVurdereYrkesskade && vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Nei) ||
      vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Nei ||
      vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Nei ||
      vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Nei
    ) {
      return false;
    }

    if (vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja) {
      return true;
    }
  } else {
    if (
      vurdering.harSkadeSykdomEllerLyte === JaEllerNei.Nei ||
      vurdering.erArbeidsevnenNedsatt === JaEllerNei.Nei ||
      (!skalVurdereYrkesskade && vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Nei) ||
      vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Nei ||
      vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Nei ||
      vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Nei
    ) {
      return false;
    }

    if (vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Ja) {
      return true;
    }

    if (vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Ja) {
      return true;
    }
  }
}

export function erTidligereVurderingOppfylt(vurdering: Sykdomvurdering): boolean | undefined {
  if (
    !vurdering.harSkadeSykdomEllerLyte ||
    vurdering.harNedsattArbeidsevne === 'NEI' ||
    vurdering.erArbeidsevnenNedsatt === false ||
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === false ||
    vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === false ||
    vurdering.erSkadeSykdomEllerLyteVesentligdel === false ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === false
  ) {
    return false;
  }

  if (
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === true ||
    vurdering.harNedsattArbeidsevne === 'JA_FORBIGÅENDE_PROBLEMER' ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === true
  ) {
    return true;
  }

  // TODO: Kan fjernes når toggle for viss varighet forsvinner
  if (
    vurdering.erSkadeSykdomEllerLyteVesentligdel === true &&
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet == null
  ) {
    return true;
  }
}

export function emptySykdomsvurdering(diagnoser?: {
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
    kodeverk: diagnoser?.kodeverk,
    hoveddiagnose: diagnoser?.hoveddiagnose,
    bidiagnose: diagnoser?.bidiagnose,
    erNedsettelseIArbeidsevneAvEnVissVarighet: undefined,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: undefined,
    yrkesskadeBegrunnelse: '',
    erNyVurdering: true,
    behøverVurdering: false,
  };
}
