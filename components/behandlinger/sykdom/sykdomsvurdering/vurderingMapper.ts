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
  | 'erNedsettelseIArbeidsevneMerEnnHalvparten'
  | 'erSkadeSykdomEllerLyteVesentligdel'
  | 'erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense'
  | 'yrkesskadeBegrunnelse'
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

  const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense =
    skalBegrunneYrkesskaden || (skalVurdereYrkesskade && !vurderingDatoSammeSomRettighetsperiodeStart)
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
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
    erNedsettelseIArbeidsevneMerEnnHalvparten,
  };
}

function mapTilPeriodisertVurdering(
  data: Sykdomsvurdering,
  skalVurdereYrkesskade: boolean,
  erÅrsakssammenhengYrkesskade: boolean,
  førsteDatoSomKanVurderes: Date,
  tilDato?: string,
  skalViseAlleSykdomssteg?: boolean
): SykdomsvurderingLøsningDto {
  const harSkadeSykdomEllerLyte = data.harSkadeSykdomEllerLyte === JaEllerNei.Ja;

  if (!skalViseAlleSykdomssteg) {
    const kodeverk = harSkadeSykdomEllerLyte ? data?.kodeverk : undefined;
    const hoveddiagnose = harSkadeSykdomEllerLyte ? data?.hoveddiagnose?.value : undefined;
    const bidiagnoser = harSkadeSykdomEllerLyte ? data.bidiagnose?.map((diagnose) => diagnose.value) : undefined;

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
  } else {
    const nedsattArbeidsevneOgYrkesskade = mapArbeidsevneOgYrkesskade(
      data,
      skalVurdereYrkesskade,
      erÅrsakssammenhengYrkesskade,
      data.fraDato,
      førsteDatoSomKanVurderes
    );

    return {
      ...nedsattArbeidsevneOgYrkesskade,
      begrunnelse: data.begrunnelse,
      fom: new Dato(data.fraDato).formaterForBackend(),
      tom: tilDato,
      harSkadeSykdomEllerLyte,
      kodeverk: data?.kodeverk,
      hoveddiagnose: data?.hoveddiagnose?.value,
      bidiagnoser: data.bidiagnose?.map((diagnose) => diagnose.value),
      dokumenterBruktIVurdering: [],
      harNedsattArbeidsevne: data.harNedsattArbeidsevne,
      erSkadeSykdomEllerLyteVesentligdel: getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel),
    };
  }
}

export default mapTilPeriodisertVurdering;
