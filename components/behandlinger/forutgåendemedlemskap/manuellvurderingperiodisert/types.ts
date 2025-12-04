import { JaEllerNei } from 'lib/utils/form';

export type ForutgåendeMedlemskapVurderingForm = {
  vurderinger: ForutgåendeMedlemskapManuellVurderingForm[];
};

export type ForutgåendeMedlemskapManuellVurderingForm = {
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: 'A' | 'B' | 'Nei';
  fraDato?: string;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
};

// TODO denne er midlertidig inntil alle mellomlagrede vurderinger har blitt periodisert (https://jira.adeo.no/browse/FAGSYSTEM-405014)
export type ForutgåendeMedlemskapVurderingFormIkkePeriodisert = {
  overstyring: boolean;
  begrunnelse: string;
  harForutgåendeMedlemskap?: JaEllerNei;
  unntaksvilkår?: string;
};
