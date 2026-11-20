import { JaEllerNei } from 'lib/utils/form';
import { AutomatiskLovvalgOgMedlemskapVurdering, VurderingFormMeta } from 'lib/types/types';

export type LovOgMedlemskapVurderingForm = {
  vurderinger: LovvalgOgMedlemskapManuellVurderingForm[];
};

export interface LovvalgOgMedlemskapManuellVurderingForm extends VurderingFormMeta {
  lovvalg: {
    begrunnelse: string;
    lovvalgsEØSLand: string;
    annetLovvalgslandMedAvtale?: string;
  };
  medlemskap?: {
    begrunnelse: string;
    varMedlemIFolketrygd: JaEllerNei;
  };
  fraDato: string;
  delvurderinger?: AutomatiskLovvalgOgMedlemskapVurdering; // Kun for visning, ikke for innsending
}

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type LovOgMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  lovvalgsLand: string;
  lovvalgBegrunnelse: string;
  medlemskapBegrunnelse: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt: JaEllerNei;
};
