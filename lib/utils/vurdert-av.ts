import { VurdertAvAnsatt } from 'lib/types/types';

export function vurdertAvFraPeriodisertVurdering(vurdertAv: VurdertAvAnsatt) {
  return vurdertAv
    ? {
        ansattnavn: vurdertAv.ansattnavn,
        ident: vurdertAv.ident,
        dato: vurdertAv.dato,
      }
    : undefined;
}
