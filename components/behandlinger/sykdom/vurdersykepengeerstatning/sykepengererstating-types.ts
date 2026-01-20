import { SykepengeerstatningVurderingGrunn, VurdertAvAnsatt } from 'lib/types/types';

export type SykepengeerstatningForm = {
  vurderinger: SykepengeerstatningVurderingForm[];
};

export type SykepengeerstatningVurderingForm = {
  begrunnelse: string;
  erOppfylt: string;
  fraDato: string;
  grunn?: SykepengeerstatningVurderingGrunn;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
};
