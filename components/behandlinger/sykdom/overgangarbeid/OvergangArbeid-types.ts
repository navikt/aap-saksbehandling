export type OvergangArbeidForm = {
  vurderinger: OvergangArbeidVurderingForm[];
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
