import { Avklaringsbehov } from 'lib/types/types';

export function kanViseOverstyrKnapp(
  automatiskVurdering: boolean,
  readOnly: boolean,
  avklaringsBehov: Avklaringsbehov[]
): boolean {
  return automatiskVurdering && !readOnly && avklaringsBehov.length === 0;
}
