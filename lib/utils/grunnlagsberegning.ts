import { GjeldendeGrunnbeløp } from '../types/types';
import { formaterTilNok } from './string';
import { formaterDatoForFrontend } from './date';

export function formaterBeregnetGrunnlag(grunnlag: number, gjeldendeGrunnbeløp: GjeldendeGrunnbeløp): string {
  const grunnlagSomBeløp = gjeldendeGrunnbeløp.grunnbeløp * grunnlag;
  const avrundetBeløp = Number(grunnlagSomBeløp.toFixed(0));

  return `${formaterTilNok(avrundetBeløp)} pr ${formaterDatoForFrontend(gjeldendeGrunnbeløp.dato)}`;
}
