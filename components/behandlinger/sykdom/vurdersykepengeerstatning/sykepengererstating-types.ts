import { VurderingFormMeta, SykepengeerstatningVurderingGrunn } from 'lib/types/types';

export type SykepengeerstatningForm = {
  vurderinger: SykepengeerstatningVurderingForm[];
};

export interface SykepengeerstatningVurderingForm extends VurderingFormMeta {
  begrunnelse: string;
  erOppfylt: string;
  fraDato: string;
  grunn?: SykepengeerstatningVurderingGrunn;
}
