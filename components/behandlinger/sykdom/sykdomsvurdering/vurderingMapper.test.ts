import { describe, expect, it } from 'vitest';
import mapTilVurdering from 'components/behandlinger/sykdom/sykdomsvurdering/vurderingMapper';
import { JaEllerNei } from 'lib/utils/form';

describe('skade eller lyte', () => {
  it('hvis ingen skade eller lyte', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Nei, // Alt under harSkadeSykdomEllerLyte skal nullstilles
        kodeverk: 'ICD10',
        hoveddiagnose: { value: 'A01', label: 'Diagnose A01' },
        bidiagnose: [
          { value: 'B01', label: 'Diagnose B01' },
          { value: 'B02', label: 'Diagnose B02' },
        ],
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'test',
      },
      true,
      true,
      true,
      true,
      true
    );

    expect(vurdering.begrunnelse).toEqual('test');
    expect(vurdering.fom).toEqual('2025-01-01');
    expect(vurdering.harSkadeSykdomEllerLyte).toBe(false); // Alt under harSkadeSykdomEllerLyte skal nullstilles

    expect(vurdering.kodeverk).toBeUndefined();
    expect(vurdering.hoveddiagnose).toBeUndefined();
    expect(vurdering.bidiagnoser).toBeUndefined();
    expect(vurdering.erArbeidsevnenNedsatt).toBeUndefined();

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });

  it('hvis skade eller lyte med diagnose', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        kodeverk: 'ICD10',
        hoveddiagnose: { value: 'A01', label: 'Diagnose A01' },
        bidiagnose: [
          { value: 'B01', label: 'Diagnose B01' },
          { value: 'B02', label: 'Diagnose B02' },
        ],
        erArbeidsevnenNedsatt: JaEllerNei.Nei, // alt under erArbeidsevnenNedsatt skal nullstilles
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'test',
      },
      true,
      true,
      true,
      true,
      true
    );

    expect(vurdering.begrunnelse).toEqual('test');
    expect(vurdering.fom).toEqual('2025-01-01');
    expect(vurdering.harSkadeSykdomEllerLyte).toBe(true);

    expect(vurdering.kodeverk).toBe('ICD10');
    expect(vurdering.hoveddiagnose).toBe('A01');
    expect(vurdering.bidiagnoser).toEqual(['B01', 'B02']);
    expect(vurdering.erArbeidsevnenNedsatt).toBe(false); // alt under erArbeidsevnenNedsatt skal nullstilles

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });
});

describe('førstegangsbehandling', () => {
  it('skal mappe riktig når arbeidsevnen ikke er nedsatt', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Nei, // alt under erArbeidsevnenNedsatt skal nullstilles
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'test',
      },
      false,
      false,
      true,
      false,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });

  it('skal mappe riktig når arbeidsevnen er nedsatt mer enn halvparten', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'test',
      },
      false,
      false,
      true,
      false,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBe(true);
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });

  it('skal mappe riktig når arbeidsevnen er nedsatt mindre enn halvparten uten yrkesskade', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'ingen yrkesskade',
      },
      false,
      false,
      true,
      false,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(false);
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBe('ingen yrkesskade');
  });

  it('skal mappe riktig med yrkesskade over yrkesskadegrense', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Nei,
        yrkesskadeBegrunnelse: 'begrunnelse yrkesskade',
      },
      true,
      false,
      true,
      false,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(false);
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(true);
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBe(false);
    expect(vurdering.yrkesskadeBegrunnelse).toBe('begrunnelse yrkesskade');
  });
});

describe('revurdering', () => {
  it('skal mappe riktig for vanlig revurdering uten årsakssammenheng', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnFørtiProsent: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Nei,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'ingen yrkesskade',
      },
      false,
      false,
      false,
      true,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBe(false);
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });

  it('skal mappe riktig for revurdering med årsakssammenheng yrkesskade', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Nei,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Ja,
        yrkesskadeBegrunnelse: 'ingen yrkesskade',
      },
      false,
      true,
      false,
      true,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense).toBe(true);
    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });

  it('skal ikke mappe nedsatt arbeidsevne hvis arbeidsevnen ikke er nedsatt i revurdering', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Nei,
      },
      false,
      false,
      false,
      true,
      false
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBeUndefined();
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBeUndefined();
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });
});

describe('revurdering av førstegangsbehandling', () => {
  it('skal bruke førstegangsbehandling logikk', () => {
    const vurdering = mapTilVurdering(
      {
        begrunnelse: 'test',
        vurderingenGjelderFra: '01.01.2025',
        harSkadeSykdomEllerLyte: JaEllerNei.Ja,
        erArbeidsevnenNedsatt: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneMerEnnHalvparten: JaEllerNei.Ja,
        erSkadeSykdomEllerLyteVesentligdel: JaEllerNei.Ja,
        erNedsettelseIArbeidsevneAvEnVissVarighet: JaEllerNei.Nei,
      },
      false,
      false,
      false,
      false,
      true
    );

    expect(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten).toBe(true);
    expect(vurdering.erSkadeSykdomEllerLyteVesentligdel).toBe(true);
    expect(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet).toBe(false);
    expect(vurdering.yrkesskadeBegrunnelse).toBeUndefined();
  });
});
