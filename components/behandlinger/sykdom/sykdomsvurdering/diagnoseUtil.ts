import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';

// Brukes kun til å finne felter for ny vurdering
export function hentSisteLagredeVurdering(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.nyeVurderinger.at(-1)?.kodeverk) {
    return grunnlag.sisteVedtatteVurderinger.at(-1);
  }
  return grunnlag.nyeVurderinger.at(-1);
}

export interface HovedDiagnoser {
  type: 'HOVEDDIAGNOSE';
  diagnose: string;
  kodeverk: string;
}

export interface BiDiagnoser {
  type: 'BIDIAGNOSE';
  diagnose: string[];
  kodeverk: string;
}

export type Diagnoser = HovedDiagnoser | BiDiagnoser;

export function finnDiagnoseGrunnlag(grunnlag: SykdomsGrunnlag): Diagnoser[] {
  return [...grunnlag.sisteVedtatteVurderinger, ...grunnlag.nyeVurderinger].flatMap((vurdering) => {
    const result: Diagnoser[] = [];

    if (vurdering.hoveddiagnose && vurdering.kodeverk) {
      result.push({
        type: 'HOVEDDIAGNOSE',
        diagnose: vurdering.hoveddiagnose,
        kodeverk: vurdering.kodeverk,
      });
    }

    if (vurdering.bidiagnoser && vurdering.kodeverk) {
      result.push({
        type: 'BIDIAGNOSE',
        diagnose: vurdering.bidiagnoser,
        kodeverk: vurdering.kodeverk,
      });
    }

    return result;
  });
}
