import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingPeriodisert';
import { JaEllerNei } from 'lib/utils/form';
import { Sykdomvurdering } from 'lib/types/types';
import { v4 as uuidv4 } from 'uuid';

export function erNyVurderingOppfylt(vurdering: Sykdomsvurdering): boolean | undefined {
  if (
    vurdering.harSkadeSykdomEllerLyte === JaEllerNei.Nei ||
    vurdering.erArbeidsevnenNedsatt === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Nei ||
    vurdering.erSkadeSykdomEllerLyteVesentligdel === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneMerEnnFørtiProsent === JaEllerNei.Nei ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Nei
  ) {
    return false;
  }

  if (
    vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet === JaEllerNei.Ja ||
    vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Ja
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
}

export function emptySykdomsvurdering(): Sykdomsvurdering {
  return {
    fraDato: '',
    begrunnelse: '',
    vurderingenGjelderFra: '',
    harSkadeSykdomEllerLyte: '',
    erArbeidsevnenNedsatt: undefined,
    erNedsettelseIArbeidsevneMerEnnHalvparten: undefined,
    erSkadeSykdomEllerLyteVesentligdel: undefined,
    kodeverk: '',
    hoveddiagnose: undefined,
    bidiagnose: [],
    erNedsettelseIArbeidsevneAvEnVissVarighet: undefined,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: undefined,
    erNedsettelseIArbeidsevneMerEnnFørtiProsent: undefined,
    yrkesskadeBegrunnelse: '',
    accordionId: uuidv4(),
  };
}
