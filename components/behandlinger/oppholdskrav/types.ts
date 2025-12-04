import { JaEllerNei } from 'lib/utils/form';

export type OppholdskravForm = {
  vurderinger: OppholdskravVurderingForm[];
};

export type OppholdskravVurderingForm = {
  begrunnelse: string;
  oppfyller?: JaEllerNei | null;
  land: string;
  landAnnet?: string;
  fraDato?: string;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
};
