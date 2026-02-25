import { JaEllerNei } from 'lib/utils/form';
import { VurderingMeta } from 'lib/types/types';

export type OppholdskravForm = {
  vurderinger: OppholdskravVurderingForm[];
};

export interface OppholdskravVurderingForm extends VurderingMeta {
  begrunnelse: string;
  oppfyller?: JaEllerNei | null;
  land: string;
  landAnnet?: string;
  fraDato: string;
}
