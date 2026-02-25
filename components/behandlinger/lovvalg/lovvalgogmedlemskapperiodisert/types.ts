import { JaEllerNei } from 'lib/utils/form';
import { VurderingMeta } from 'lib/types/types';

export type LovOgMedlemskapVurderingForm = {
  vurderinger: LovvalgOgMedlemskapManuellVurderingForm[];
};

export interface LovvalgOgMedlemskapManuellVurderingForm extends VurderingMeta {
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
}

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type LovOgMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  lovvalgsLand: string;
  lovvalgBegrunnelse: string;
  medlemskapBegrunnelse: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt: JaEllerNei;
};
