import { Hjemmel, ÅrsakTilBehandling } from 'lib/types/types';

export const hjemmelMap: Partial<Record<Hjemmel, string>> = {
  FOLKETRYGDLOVEN_11_5: '$ 11-5',
  FOLKETRYGDLOVEN_11_6: '$ 11-6',
};

export const hjemmelalternativer = Object.entries(hjemmelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));

export const hjemmelÅrsakMapMap: Partial<Record<Hjemmel, ÅrsakTilBehandling>> = {
  FOLKETRYGDLOVEN_11_5: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
  FOLKETRYGDLOVEN_11_6: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
};
