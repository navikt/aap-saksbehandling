import { JaEllerNei } from 'lib/utils/form';
import { PeriodisertVurderingMeta, VurdertAvAnsatt } from 'lib/types/types';

export type OppholdskravForm = {
  vurderinger: OppholdskravVurderingForm[];
};

export interface OppholdskravVurderingForm extends PeriodisertVurderingMeta {
  begrunnelse: string;
  oppfyller?: JaEllerNei | null;
  land: string;
  landAnnet?: string;
  fraDato?: string;
}
