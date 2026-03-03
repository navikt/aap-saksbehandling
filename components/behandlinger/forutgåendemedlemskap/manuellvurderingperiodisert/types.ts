import { JaEllerNei } from 'lib/utils/form';
import { VurderingMeta } from 'lib/types/types';

export type ForutgåendeMedlemskapVurderingForm = {
  vurderinger: ForutgåendeMedlemskapManuellVurderingForm[];
};

export interface ForutgåendeMedlemskapManuellVurderingForm extends VurderingMeta {
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: 'A' | 'B' | 'Nei';
  fraDato: string;
}

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type ForutgåendeMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: string;
};
