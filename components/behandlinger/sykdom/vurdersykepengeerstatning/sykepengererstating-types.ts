import { SykepengeerstatningVurderingGrunn } from 'lib/types/types';

export type SykepengeerstatningForm = {
  vurderinger: SykepengeerstatningVurderingForm[];
};

export type SykepengeerstatningVurderingForm = {
  begrunnelse: string;
  erOppfylt: string;
  fraDato: string;
  grunn?: SykepengeerstatningVurderingGrunn;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
};
