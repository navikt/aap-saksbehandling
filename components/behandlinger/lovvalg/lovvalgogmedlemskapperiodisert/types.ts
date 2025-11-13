import { JaEllerNei } from 'lib/utils/form';

export type LovOgMedlemskapVurderingForm = {
  vurderinger: LovvalgOgMedlemskapManuellVurderingForm[];
};

export type LovvalgOgMedlemskapManuellVurderingForm = {
  vurderingId?: string;
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

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type LovOgMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  lovvalgsLand: string;
  lovvalgBegrunnelse: string;
  medlemskapBegrunnelse: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt: JaEllerNei;
};
