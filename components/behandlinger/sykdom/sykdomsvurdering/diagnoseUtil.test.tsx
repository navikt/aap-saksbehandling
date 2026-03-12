import { SykdomsGrunnlag, SykdomsvurderingResponse } from 'lib/types/types';
import { describe, expect, it } from 'vitest';
import {
  Diagnoser,
  finnDiagnoseGrunnlagForSykdom,
  getDefaultOptionsForDiagnosesystem,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';

const sisteVedtatteVurderinger: SykdomsvurderingResponse[] = [
  {
    vurdertAv: {
      ident: 'SAKSBEHANDLER',
      dato: '2026-03-12',
      ansattnavn: 'Test Testesen',
      enhetsnavn: 'Lokalenhetsnavn',
    },
    fom: '2026-03-12',
    begrunnelse: 'hei',
    vurderingenGjelderFra: '2026-03-12',
    dokumenterBruktIVurdering: [],
    erArbeidsevnenNedsatt: true,
    harSkadeSykdomEllerLyte: true,
    erSkadeSykdomEllerLyteVesentligdel: true,
    erNedsettelseIArbeidsevneAvEnVissVarighet: true,
    erNedsettelseIArbeidsevneMerEnnHalvparten: true,
    kodeverk: 'ICPC2',
    hoveddiagnose: 'A01',
    bidiagnoser: ['A04'],
  },
  {
    vurdertAv: {
      ident: 'SAKSBEHANDLER',
      dato: '2026-03-12',
      ansattnavn: 'Test Testesen',
      enhetsnavn: 'Lokalenhetsnavn',
    },
    fom: '2026-04-01',
    tom: '2026-04-30',
    begrunnelse: 'hei',
    vurderingenGjelderFra: '2026-04-01',
    dokumenterBruktIVurdering: [],
    erArbeidsevnenNedsatt: false,
    harSkadeSykdomEllerLyte: true,
    kodeverk: 'ICPC2',
    hoveddiagnose: 'P72',
    bidiagnoser: ['R991'],
  },
  {
    fom: '2026-05-01',
    vurdertAv: {
      ident: 'SAKSBEHANDLER',
      dato: '2026-03-12',
      ansattnavn: 'Test Testesen',
      enhetsnavn: 'Lokalenhetsnavn',
    },
    begrunnelse: 'nei',
    vurderingenGjelderFra: '2026-05-01',
    dokumenterBruktIVurdering: [],
    erArbeidsevnenNedsatt: false,
    harSkadeSykdomEllerLyte: true,
    kodeverk: 'ICD10',
    hoveddiagnose: 'A001',
    bidiagnoser: ['A010'],
  },
];

const nyeVurderinger: SykdomsvurderingResponse[] = [
  {
    vurdertAv: {
      ident: 'SAKSBEHANDLER',
      dato: '2026-03-12',
      ansattnavn: 'Test Testesen',
      enhetsnavn: 'Lokalenhetsnavn',
    },
    fom: '2026-06-01',
    begrunnelse: 'hei',
    vurderingenGjelderFra: '2026-06-01',
    dokumenterBruktIVurdering: [],
    erArbeidsevnenNedsatt: false,
    harSkadeSykdomEllerLyte: true,
    kodeverk: 'ICPC2',
    hoveddiagnose: 'A04',
    bidiagnoser: ['A05'],
  },
];

const grunnlag: SykdomsGrunnlag = {
  nyeVurderinger: nyeVurderinger,
  sisteVedtatteVurderinger: sisteVedtatteVurderinger,
  behøverVurderinger: [],
  erÅrsakssammenhengYrkesskade: false,
  harTilgangTilÅSaksbehandle: true,
  ikkeRelevantePerioder: [],
  kanVurderes: [],
  opplysninger: {
    innhentedeYrkesskader: [],
    oppgittYrkesskadeISøknad: false,
  },
  skalVurdereYrkesskade: false,
};

describe('finnDiagnoseGrunnlag', () => {
  it('skal hente alle hoved- og bidiagnoser fra siste vedtatte vurderinger og nye vurderinger', () => {
    const result = finnDiagnoseGrunnlagForSykdom(grunnlag);

    expect(result).toEqual([
      { type: 'HOVEDDIAGNOSE', diagnose: 'A01', kodeverk: 'ICPC2' },
      { type: 'BIDIAGNOSE', diagnose: ['A04'], kodeverk: 'ICPC2' },

      { type: 'HOVEDDIAGNOSE', diagnose: 'P72', kodeverk: 'ICPC2' },
      { type: 'BIDIAGNOSE', diagnose: ['R991'], kodeverk: 'ICPC2' },

      { type: 'HOVEDDIAGNOSE', diagnose: 'A001', kodeverk: 'ICD10' },
      { type: 'BIDIAGNOSE', diagnose: ['A010'], kodeverk: 'ICD10' },

      { type: 'HOVEDDIAGNOSE', diagnose: 'A04', kodeverk: 'ICPC2' },
      { type: 'BIDIAGNOSE', diagnose: ['A05'], kodeverk: 'ICPC2' },
    ]);
  });

  it('skal returnere riktig antall diagnoser', () => {
    const result = finnDiagnoseGrunnlagForSykdom(grunnlag);

    expect(result).toHaveLength(8);
  });

  it('skal inneholde både hoveddiagnoser og bidiagnoser', () => {
    const result = finnDiagnoseGrunnlagForSykdom(grunnlag);

    const hoveddiagnoser = result.filter((diagnose) => diagnose.type === 'HOVEDDIAGNOSE');
    const bidiagnoser = result.filter((diagnose) => diagnose.type === 'BIDIAGNOSE');

    expect(hoveddiagnoser).toHaveLength(4);
    expect(bidiagnoser).toHaveLength(4);
  });
});

describe('getDefaultOptionsForDiagnosesystem', () => {
  it('Skal hente diagnoser fra grunnlaget', async () => {
    const diagnoseGrunnlag = finnDiagnoseGrunnlagForSykdom(grunnlag);
    const result = await getDefaultOptionsForDiagnosesystem(diagnoseGrunnlag);

    expect(result.ICD10.hoveddiagnoserOptions).toEqual(
      expect.arrayContaining([{ label: 'Kolera som skyldes Vibrio cholerae 01, biovar eltor (A001)', value: 'A001' }])
    );

    expect(result.ICD10.bidiagnoserOptions).toEqual(
      expect.arrayContaining([{ label: 'Tyfoidfeber (A010)', value: 'A010' }])
    );

    expect(result.ICPC2.hoveddiagnoserOptions).toEqual(
      expect.arrayContaining([
        { label: 'Smerte generell/flere steder (A01)', value: 'A01' },
        { label: 'Schizofreni (P72)', value: 'P72' },
        { label: 'Slapphet/tretthet (A04)', value: 'A04' },
      ])
    );

    expect(result.ICPC2.bidiagnoserOptions).toEqual(
      expect.arrayContaining([
        { label: 'Slapphet/tretthet (A04)', value: 'A04' },
        { label: 'Covid-19 (mistenkt/sannsynlig) (R991)', value: 'R991' },
        { label: 'Sykdomsfølelse (A05)', value: 'A05' },
      ])
    );
  });

  it('skal legge hoveddiagnoser i riktig system', async () => {
    const defaultValue: Diagnoser[] = [
      { type: 'HOVEDDIAGNOSE', diagnose: 'A01', kodeverk: 'ICPC2' },
      { type: 'HOVEDDIAGNOSE', diagnose: 'B010', kodeverk: 'ICD10' },
    ];

    const result = await getDefaultOptionsForDiagnosesystem(defaultValue);

    expect(result.ICPC2.hoveddiagnoserOptions).toContainEqual({
      label: 'Smerte generell/flere steder (A01)',
      value: 'A01',
    });
    expect(result.ICD10.hoveddiagnoserOptions).toContainEqual({ label: 'Varicellameningitt (B010)', value: 'B010' });
  });

  it('skal legge bidiagnoser i riktig system', async () => {
    const defaultValue: Diagnoser[] = [
      {
        type: 'BIDIAGNOSE',
        diagnose: ['A04', 'A05'],
        kodeverk: 'ICPC2',
      },
    ];

    const result = await getDefaultOptionsForDiagnosesystem(defaultValue);

    expect(result.ICPC2.bidiagnoserOptions).toEqual(
      expect.arrayContaining([
        { label: 'Slapphet/tretthet (A04)', value: 'A04' },
        { label: 'Sykdomsfølelse (A05)', value: 'A05' },
      ])
    );
  });

  it('skal fjerne duplikater basert på value', async () => {
    const defaultValue: Diagnoser[] = [
      { type: 'HOVEDDIAGNOSE', diagnose: 'A01', kodeverk: 'ICPC2' },
      { type: 'HOVEDDIAGNOSE', diagnose: 'A01', kodeverk: 'ICPC2' },
    ];

    const result = await getDefaultOptionsForDiagnosesystem(defaultValue);

    const values = result.ICPC2.hoveddiagnoserOptions.map((o) => o.value);

    expect(values.filter((value) => value === 'A01')).toHaveLength(1);
  });

  it('skal fortsatt returnere ekstra options når defaultValue er undefined', async () => {
    const result = await getDefaultOptionsForDiagnosesystem();

    expect(result.ICPC2.hoveddiagnoserOptions.length).toBe(50);
    expect(result.ICPC2.bidiagnoserOptions.length).toBe(50);
    expect(result.ICD10.hoveddiagnoserOptions.length).toBe(50);
    expect(result.ICD10.bidiagnoserOptions.length).toBe(50);
  });
});
