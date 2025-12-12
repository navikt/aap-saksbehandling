export type OvergangArbeidForm = {
  vurderinger: OvergangArbeidVurderingForm[];
};

export type OvergangArbeidFormOld = {
  begrunnelse: string;
  brukerRettPåAAP?: string;
  fom: string;
};

export type OvergangArbeidVurderingForm = {
  begrunnelse: string;
  brukerRettPåAAP: string;
  fraDato: string;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
};
