import { VurderingFormMeta } from 'lib/types/types';

export type OvergangArbeidForm = {
  vurderinger: OvergangArbeidVurderingForm[];
};

export type OvergangArbeidFormOld = {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  fom: string;
};

export interface OvergangArbeidVurderingForm extends VurderingFormMeta {
  begrunnelse: string;
  brukerRettPåAAP: string;
  fraDato: string;
}
