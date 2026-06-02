import { getTrueFalseEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { SykdomsvurderingLøsningDto } from 'lib/types/types';
import { Sykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Sykdomsvurdering';
import { Dato } from 'lib/types/Dato';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { vurderingFraDatoErSammeSomRettighetsperiodeStart } from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';

function mapArbeidsevneOgYrkesskade(
  data: Sykdomsvurdering,
  skalVurdereYrkesskade: boolean,
  erÅrsakssammenhengYrkesskade: boolean,
  vurderingFraDato: string,
  førsteDatoSomKanVurderes: Date
): Pick<
  SykdomsvurderingLøsningDto,
  'erSkadeSykdomEllerLyteVesentligdel' | 'erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense' | 'yrkesskadeBegrunnelse'
> {
  const fraDato = parseDatoFraDatePicker(vurderingFraDato);
  const vurderingDatoSammeSomRettighetsperiodeStart = vurderingFraDatoErSammeSomRettighetsperiodeStart(
    fraDato,
    førsteDatoSomKanVurderes
  );

  // Ikke aktuell hvis årsakssammenheng på yrkesskade
  const erNedsettelseIArbeidsevneMerEnnHalvparten = erÅrsakssammenhengYrkesskade
    ? undefined
    : getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnHalvparten);

  const skalBegrunneYrkesskaden =
    vurderingDatoSammeSomRettighetsperiodeStart && skalVurdereYrkesskade && !erNedsettelseIArbeidsevneMerEnnHalvparten;

  const yrkesskadeBegrunnelse = skalBegrunneYrkesskaden ? data?.yrkesskadeBegrunnelse : undefined;

  const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense = skalVurdereYrkesskade
    ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)
    : undefined;

  // Kun mappe derson bruker har tilstrekkelig nedsatt arbeidsevne
  const erSkadeSykdomEllerLyteVesentligdel =
    erNedsettelseIArbeidsevneMerEnnHalvparten || erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
      ? getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel)
      : undefined;

  return {
    yrkesskadeBegrunnelse,
    erSkadeSykdomEllerLyteVesentligdel,
  };
}

function mapTilPeriodisertVurdering(
  data: Sykdomsvurdering,
  skalVurdereYrkesskade: boolean,
  erÅrsakssammenhengYrkesskade: boolean,
  førsteDatoSomKanVurderes: Date,
  tilDato?: string
): SykdomsvurderingLøsningDto {
  // Denne overstyrer alle verdiene under. Hvis false skal alt nulles ut.
  const harSkadeSykdomEllerLyte = data.harSkadeSykdomEllerLyte === JaEllerNei.Ja;

  const kodeverk = harSkadeSykdomEllerLyte ? data?.kodeverk : undefined;
  const hoveddiagnose = harSkadeSykdomEllerLyte ? data?.hoveddiagnose?.value : undefined;
  const bidiagnoser = harSkadeSykdomEllerLyte ? data.bidiagnose?.map((diagnose) => diagnose.value) : undefined;

  // Denne overstyrer de under. Hvis false skal alt nulles ut.
  const erArbeidsevnenNedsatt = harSkadeSykdomEllerLyte
    ? data.harNedsattArbeidsevne && data.harNedsattArbeidsevne !== 'NEI'
    : undefined;

  const nedsattArbeidsevneOgYrkesskade = erArbeidsevnenNedsatt
    ? mapArbeidsevneOgYrkesskade(
        data,
        skalVurdereYrkesskade,
        erÅrsakssammenhengYrkesskade,
        data.fraDato,
        førsteDatoSomKanVurderes
      )
    : undefined;

  return {
    ...nedsattArbeidsevneOgYrkesskade,
    begrunnelse: data.begrunnelse,
    fom: new Dato(data.fraDato).formaterForBackend(),
    tom: tilDato,
    harSkadeSykdomEllerLyte,
    kodeverk,
    hoveddiagnose,
    bidiagnoser,
    dokumenterBruktIVurdering: [],
    harNedsattArbeidsevne: harSkadeSykdomEllerLyte ? data.harNedsattArbeidsevne : undefined,
  };
}

export default mapTilPeriodisertVurdering;
