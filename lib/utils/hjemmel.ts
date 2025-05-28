import { Hjemmel, ÅrsakTilBehandling } from 'lib/types/types';

export const hjemmelMap: Partial<Record<Hjemmel, string>> = {
  FOLKETRYGDLOVEN_11_2: '$ 11-2',
  FOLKETRYGDLOVEN_11_5: '$ 11-5',
  FOLKETRYGDLOVEN_11_6: '$ 11-6',
  FOLKETRYGDLOVEN_11_10_FRITAK: '$ 11-10 - Fritak meldeplikt',
  FOLKETRYGDLOVEN_11_13: '$ 11-13',
  FOLKETRYGDLOVEN_11_17: '$ 11-17',
  FOLKETRYGDLOVEN_11_18: '$ 11-18',
  FOLKETRYGDLOVEN_11_19: '$ 11-19',
  FOLKETRYGDLOVEN_11_20: '$ 11-20',
  FOLKETRYGDLOVEN_11_22: '$ 11-22',
  FOLKETRYGDLOVEN_11_23_UUTNYTTET_ARB_EVNE: '§ 11-23 2. ledd',
  FOLKETRYGDLOVEN_11_24: '§ 11-24',
  FOLKETRYGDLOVEN_11_25: '§ 11-25',
  FOLKETRYGDLOVEN_11_26: '§ 11-26',
  FOLKETRYGDLOVEN_11_27: '§ 11-27',
  FOLKETRYGDLOVEN_11_28: '§ 11-28',
};

export const hjemmelalternativer = Object.entries(hjemmelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));

export const hjemmelÅrsakMapMap: Partial<Record<Hjemmel, ÅrsakTilBehandling>> = {
  FOLKETRYGDLOVEN_11_5: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
  FOLKETRYGDLOVEN_11_6: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
};
