import { PeriodisertVurderingMeta, SykepengeerstatningVurderingGrunn, VurdertAvAnsatt } from 'lib/types/types';

export type SykepengeerstatningForm = {
  vurderinger: SykepengeerstatningVurderingForm[];
};

export interface SykepengeerstatningVurderingForm extends PeriodisertVurderingMeta {
  begrunnelse: string;
  erOppfylt: string;
  fraDato: string;
  grunn?: SykepengeerstatningVurderingGrunn;
}
