import { JaEllerNei } from 'lib/utils/form';
import { VurderingFormMeta } from 'lib/types/types';

export type OppholdskravForm = {
  vurderinger: OppholdskravVurderingForm[];
};

export interface OppholdskravVurderingForm extends VurderingFormMeta {
  begrunnelse: string;
  oppfyller?: JaEllerNei | null;
  land: string;
  landAnnet?: string;
  fraDato: string;
}
