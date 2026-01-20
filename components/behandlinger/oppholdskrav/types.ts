import { JaEllerNei } from 'lib/utils/form';
import { VurdertAvAnsatt } from 'lib/types/types';

export type OppholdskravForm = {
  vurderinger: OppholdskravVurderingForm[];
};

export type OppholdskravVurderingForm = {
  begrunnelse: string;
  oppfyller?: JaEllerNei | null;
  land: string;
  landAnnet?: string;
  fraDato?: string;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
};
