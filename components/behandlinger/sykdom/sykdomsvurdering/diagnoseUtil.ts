import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';

// Brukes kun til å finne felter for ny vurdering
export function finnDiagnosegrunnlag(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
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

export function finnDiagnoseGrunnlagForHovedDiagnose(grunnlag: SykdomsGrunnlag): HovedDiagnoser[] {
  return [...grunnlag.sisteVedtatteVurderinger, ...grunnlag.nyeVurderinger]
    .filter(
      (vurdering): vurdering is typeof vurdering & { hoveddiagnose: string; kodeverk: string } =>
        vurdering.hoveddiagnose != null && vurdering.kodeverk != null
    )
    .map((vurdering) => ({
      diagnose: vurdering.hoveddiagnose,
      kodeverk: vurdering.kodeverk,
      type: 'HOVEDDIAGNOSE',
    }));
}

export interface BiDiagnoser {
  type: 'BIDIAGNOSE';
  diagnose: string[];
  kodeverk: string;
}

export function finnDiagnoseGrunnlagForBiDiagnose(grunnlag: SykdomsGrunnlag): BiDiagnoser[] {
  return [...grunnlag.sisteVedtatteVurderinger, ...grunnlag.nyeVurderinger].flatMap((vurdering) =>
    vurdering.bidiagnoser && vurdering.kodeverk
      ? [{ type: 'BIDIAGNOSE', diagnose: vurdering.bidiagnoser, kodeverk: vurdering.kodeverk }]
      : []
  );
}

export type Diagnoser = HovedDiagnoser | BiDiagnoser;
