import { PeriodisertVurderingMeta, VurdertAvAnsatt } from 'lib/types/types';

export type OvergangArbeidForm = {
  vurderinger: OvergangArbeidVurderingForm[];
};

export type OvergangArbeidFormOld = {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  fom: string;
};

export interface OvergangArbeidVurderingForm extends PeriodisertVurderingMeta {
  begrunnelse: string;
  brukerRettPåAAP: string;
  fraDato: string;
}
