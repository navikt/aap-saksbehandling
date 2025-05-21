import { Hjemmel, ÅrsakTilBehandling } from 'lib/types/types';

export const hjemmelMap: Partial<Record<Hjemmel, string>> = {
  FOLKETRYGDLOVEN_11_2: '$ 11-2',
  FOLKETRYGDLOVEN_11_5: '$ 11-5',
  FOLKETRYGDLOVEN_11_6: '$ 11-6',
  FOLKETRYGDLOVEN_11_13: '$ 11-13',
  FOLKETRYGDLOVEN_11_17: '$ 11-17',
  FOLKETRYGDLOVEN_11_18: '$ 11-18',
  FOLKETRYGDLOVEN_11_20: '$ 11-20',
  FOLKETRYGDLOVEN_11_22: '$ 11-22',
  FOLKETRYGDLOVEN_11_24: '$ 11-24',
};

export const hjemmelalternativer = Object.entries(hjemmelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));

export const hjemmelÅrsakMapMap: Partial<Record<Hjemmel, ÅrsakTilBehandling>> = {
  FOLKETRYGDLOVEN_11_5: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
  FOLKETRYGDLOVEN_11_6: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
};
