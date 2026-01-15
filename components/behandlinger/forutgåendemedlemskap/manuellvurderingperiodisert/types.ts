import { JaEllerNei } from 'lib/utils/form';
import { VurdertAvAnsatt } from 'lib/types/types';

export type ForutgåendeMedlemskapVurderingForm = {
  vurderinger: ForutgåendeMedlemskapManuellVurderingForm[];
};

export type ForutgåendeMedlemskapManuellVurderingForm = {
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: 'A' | 'B' | 'Nei';
  fraDato?: string;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
};

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type ForutgåendeMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: string;
};
