import { VurdertAvAnsatt } from 'lib/types/types';

export type OvergangArbeidForm = {
  vurderinger: OvergangArbeidVurderingForm[];
};

export type OvergangArbeidFormOld = {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  fom: string;
};

export type OvergangArbeidVurderingForm = {
  begrunnelse: string;
  brukerRettPåAAP: string;
  fraDato: string;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
};
