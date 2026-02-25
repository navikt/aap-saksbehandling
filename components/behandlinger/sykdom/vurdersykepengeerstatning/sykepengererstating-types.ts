import { VurderingMeta, SykepengeerstatningVurderingGrunn } from 'lib/types/types';

export type SykepengeerstatningForm = {
  vurderinger: SykepengeerstatningVurderingForm[];
};

export interface SykepengeerstatningVurderingForm extends VurderingMeta {
  begrunnelse: string;
  erOppfylt: string;
  fraDato: string;
  grunn?: SykepengeerstatningVurderingGrunn;
}
