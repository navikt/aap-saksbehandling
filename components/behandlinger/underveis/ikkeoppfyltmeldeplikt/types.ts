import { MeldepliktOverstyringStatus } from 'lib/types/types';

export type MeldepliktOverstyringVurdering = {
  fraDato: string;
  tilDato: string;
  begrunnelse: string;
  meldepliktOverstyringStatus: MeldepliktOverstyringStatus;
};

export type MeldepliktOverstyringFormFields = {
  vurderinger: MeldepliktOverstyringVurdering[];
};
