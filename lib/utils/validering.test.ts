import { describe, expect, it } from 'vitest';
import { erProsent, validerPeriodiserteVurderingerMotIkkeRelevantePerioder } from 'lib/utils/validering';
import { PeriodiserteVurderingerDto, PeriodisertVurderingFormFields, VurderingDto } from 'lib/types/types';
import { UseFormReturn } from 'react-hook-form';

describe('erProsent', () => {
  it('skal returnere true hvis value er 50', () => {
    expect(erProsent(50)).toBeTruthy();
  });

  it('skal returnere true hvis value er 77', () => {
    expect(erProsent(77)).toBeTruthy();
  });

  it('skal returnere true hvis value er 0', () => {
    expect(erProsent(0)).toBeTruthy();
  });

  it('skal returnere true hvis value er 100', () => {
    expect(erProsent(100)).toBeTruthy();
  });

  it('skal returnere false hvis value er negativ', () => {
    expect(erProsent(-1)).toBeFalsy();
  });

  it('skal returnere false hvis value er over 100', () => {
    expect(erProsent(101)).toBeFalsy();
  });
});

const grunnlag: PeriodiserteVurderingerDto<VurderingDto> = {
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: false,
  ikkeRelevantePerioder: [{ fom: '2026-02-18', tom: '2026-02-26' }],
  kanVurderes: [],
  nyeVurderinger: [],
  sisteVedtatteVurderinger: [],
};

// @ts-expect-error
const form: UseFormReturn<any> = {
  setError: () => {},
};
describe('validerPeriodiserteVurderingerMotIkkeRelevantePerioder', () => {
  it('før ikke-relevant periode skal gi true', () => {
    const nyeVurderinger: Array<PeriodisertVurderingFormFields> = [
      {
        fraDato: '17.02.2026',
      },
    ];
    const validering = validerPeriodiserteVurderingerMotIkkeRelevantePerioder({ grunnlag, form, nyeVurderinger });
    expect(validering).toBe(true);
  });
  it('etter ikke-relevant periode skal gi true', () => {
    const nyeVurderinger: Array<PeriodisertVurderingFormFields> = [
      {
        fraDato: '27.02.2026',
      },
    ];
    const validering = validerPeriodiserteVurderingerMotIkkeRelevantePerioder({ grunnlag, form, nyeVurderinger });
    expect(validering).toBe(true);
  });
  it('i ikke-relevant periode skal gi false', () => {
    const nyeVurderinger: Array<PeriodisertVurderingFormFields> = [
      {
        fraDato: '20.02.2026',
      },
    ];
    const validering = validerPeriodiserteVurderingerMotIkkeRelevantePerioder({ grunnlag, form, nyeVurderinger });
    expect(validering).toBe(false);
  });
  it('i ikke-relevant periode på kun en dag skal gi false', () => {
    const enDagsGrunnlag: PeriodiserteVurderingerDto<VurderingDto> = {
      behøverVurderinger: [],
      harTilgangTilÅSaksbehandle: false,
      ikkeRelevantePerioder: [{ fom: '2026-02-18', tom: '2026-02-18' }],
      kanVurderes: [],
      nyeVurderinger: [],
      sisteVedtatteVurderinger: [],
    };
    const nyeVurderinger: Array<PeriodisertVurderingFormFields> = [
      {
        fraDato: '18.02.2026',
      },
    ];
    const validering = validerPeriodiserteVurderingerMotIkkeRelevantePerioder({
      grunnlag: enDagsGrunnlag,
      form,
      nyeVurderinger,
    });
    expect(validering).toBe(false);
  });
});
