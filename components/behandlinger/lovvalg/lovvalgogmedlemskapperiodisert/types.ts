import { JaEllerNei } from 'lib/utils/form';

export type LovOgMedlemskapVurderingForm = {
  vurderinger: LovvalgOgMedlemskapManuellVurderingForm[];
};

export type LovvalgOgMedlemskapManuellVurderingForm = {
  begrunnelse: string;
  lovvalg: {
    begrunnelse: string;
    lovvalgsEØSLand: string;
    annetLovvalgslandMedAvtale?: string;
  };
  medlemskap?: {
    begrunnelse: string;
    varMedlemIFolketrygd: JaEllerNei;
  };
  fraDato?: string;
  vurdertAv?: {
    navn?: string | null;
    ident: string;
    dato: string;
  };
};
