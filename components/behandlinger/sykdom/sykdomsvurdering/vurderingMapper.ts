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
  førsteDatoSomKanVurderes: Date,
  sykdomsvurderingVissVarighetToggle: boolean
): Pick<
  SykdomsvurderingLøsningDto,
  | 'erNedsettelseIArbeidsevneMerEnnHalvparten'
  | 'erSkadeSykdomEllerLyteVesentligdel'
  | 'erNedsettelseIArbeidsevneAvEnVissVarighet'
  | 'erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense'
  | 'yrkesskadeBegrunnelse'
  | 'erNedsettelseMerEnnYrkesskadegrense'
  | 'erNedsettelseMinstHalvparten'
> {
  const fraDato = parseDatoFraDatePicker(vurderingFraDato);
  const vurderingDatoSammeSomRettighetsperiodeStart = vurderingFraDatoErSammeSomRettighetsperiodeStart(
    fraDato,
    førsteDatoSomKanVurderes
  );

  if (sykdomsvurderingVissVarighetToggle) {
    // Ikke aktuell hvis årsakssammenheng på yrkesskade
    const erNedsettelseIArbeidsevneMerEnnHalvparten = erÅrsakssammenhengYrkesskade
      ? undefined
      : getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnHalvparten);
    const skalBegrunneYrkesskaden =
      vurderingDatoSammeSomRettighetsperiodeStart &&
      skalVurdereYrkesskade &&
      !erNedsettelseIArbeidsevneMerEnnHalvparten;

    const yrkesskadeBegrunnelse = skalBegrunneYrkesskaden ? data?.yrkesskadeBegrunnelse : undefined;

    const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense =
      skalBegrunneYrkesskaden || (!vurderingDatoSammeSomRettighetsperiodeStart && erÅrsakssammenhengYrkesskade)
        ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)
        : undefined;

    // Kun mappe derson bruker har tilstrekkelig nedsatt arbeidsevne
    const erSkadeSykdomEllerLyteVesentligdel =
      erNedsettelseIArbeidsevneMerEnnHalvparten || erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
        ? getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel)
        : undefined;

    const erNedsettelseIArbeidsevneAvEnVissVarighetBakoverkompatibel = data.harNedsattArbeidsevne === 'JA';

    return {
      yrkesskadeBegrunnelse,
      erSkadeSykdomEllerLyteVesentligdel,
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
      erNedsettelseIArbeidsevneMerEnnHalvparten,

      // Disse må settes for bakoverkompabilitet men kan fjernes på sikt
      erNedsettelseIArbeidsevneAvEnVissVarighet: erNedsettelseIArbeidsevneAvEnVissVarighetBakoverkompatibel,
    };
  } else {
    const erNedsettelseIArbeidsevneMerEnnHalvparten = erÅrsakssammenhengYrkesskade
      ? undefined
      : getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnHalvparten);
    const skalBegrunneYrkesskaden =
      vurderingDatoSammeSomRettighetsperiodeStart &&
      skalVurdereYrkesskade &&
      !erNedsettelseIArbeidsevneMerEnnHalvparten;

    const yrkesskadeBegrunnelse = skalBegrunneYrkesskaden ? data?.yrkesskadeBegrunnelse : undefined;

    const erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense =
      skalBegrunneYrkesskaden || (!vurderingDatoSammeSomRettighetsperiodeStart && erÅrsakssammenhengYrkesskade)
        ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense)
        : undefined;

    // Kun mappe derson bruker har tilstrekkelig nedsatt arbeidsevne
    const erSkadeSykdomEllerLyteVesentligdel =
      erNedsettelseIArbeidsevneMerEnnHalvparten || erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
        ? getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel)
        : undefined;

    // Kun aktuell dersom skade eller sykdom er vesentling medvirkende til den nedsatte arbeidsevnen
    const erNedsettelseIArbeidsevneAvEnVissVarighet = erSkadeSykdomEllerLyteVesentligdel
      ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneAvEnVissVarighet)
      : undefined;

    return {
      erNedsettelseIArbeidsevneMerEnnHalvparten,
      yrkesskadeBegrunnelse,
      erSkadeSykdomEllerLyteVesentligdel,
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
      erNedsettelseIArbeidsevneAvEnVissVarighet,
    };
  }
}

function mapTilPeriodisertVurdering(
  data: Sykdomsvurdering,
  skalVurdereYrkesskade: boolean,
  erÅrsakssammenhengYrkesskade: boolean,
  førsteDatoSomKanVurderes: Date,
  sykdomsvurderingVissVarighetToggle: boolean,
  tilDato?: string
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

  const nedsattArbeidsevneOgYrkesskade = erArbeidsevnenNedsatt
    ? mapArbeidsevneOgYrkesskade(
        data,
        skalVurdereYrkesskade,
        erÅrsakssammenhengYrkesskade,
        data.fraDato,
        førsteDatoSomKanVurderes,
        sykdomsvurderingVissVarighetToggle
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
    erArbeidsevnenNedsatt,
    dokumenterBruktIVurdering: [],
  };
}

export default mapTilPeriodisertVurdering;
