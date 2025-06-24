import { Hjemmel, ÅrsakTilBehandling } from 'lib/types/types';

export const getValgteHjemlerSomIkkeErImplementert = (value: string | Hjemmel[] | undefined): Hjemmel[] => {
  if (!value || !Array.isArray(value)) return [];

  return value.filter((hjemmel) => ikkeImplementertKlageHjemmler.includes(hjemmel));
};

export const hjemmelMap: Partial<Record<Hjemmel, string>> = {
  FOLKETRYGDLOVEN_11_2: '§ 11-2',
  FOLKETRYGDLOVEN_11_3: '§ 11-3',
  FOLKETRYGDLOVEN_11_4: '§ 11-4',
  FOLKETRYGDLOVEN_11_5: '§ 11-5',
  FOLKETRYGDLOVEN_11_6: '§ 11-6',
  FOLKETRYGDLOVEN_11_7: '§ 11-7',
  FOLKETRYGDLOVEN_11_8: '§ 11-8',
  FOLKETRYGDLOVEN_11_9: '§ 11-9',
  FOLKETRYGDLOVEN_11_10_FRITAK: '§ 11-10 3. ledd - Fritak meldeplikt',
  FOLKETRYGDLOVEN_11_10_MELDEPLIKT: '§ 11-10 - Meldeplikt',
  FOLKETRYGDLOVEN_11_12: '§ 11-12',
  FOLKETRYGDLOVEN_11_13: '§ 11-13',
  FOLKETRYGDLOVEN_11_14: '§ 11-14',
  FOLKETRYGDLOVEN_11_15: '§ 11-15',
  FOLKETRYGDLOVEN_11_17: '§ 11-17',
  FOLKETRYGDLOVEN_11_18: '§ 11-18',
  FOLKETRYGDLOVEN_11_19: '§ 11-19',
  FOLKETRYGDLOVEN_11_20: '§ 11-20',
  FOLKETRYGDLOVEN_11_22: '§ 11-22',
  FOLKETRYGDLOVEN_11_23_UUTNYTTET_ARB_EVNE: '§ 11-23 2. ledd',
  FOLKETRYGDLOVEN_11_23_OVERGNG_ARB: '11-23 Nær ved å komme i fullt arbeid',
  FOLKETRYGDLOVEN_11_24: '§ 11-24',
  FOLKETRYGDLOVEN_11_25: '§ 11-25',
  FOLKETRYGDLOVEN_11_26: '§ 11-26',
  FOLKETRYGDLOVEN_11_27: '§ 11-27',
  FOLKETRYGDLOVEN_11_28: '§ 11-28',
  FOLKETRYGDLOVEN_11_29: '§ 11-29',
  FOLKETRYGDLOVEN_11_31: '§ 11-31',
  FOLKETRYGDLOVEN_22_13: '§ 22-13',
  FOLKETRYGDLOVEN_22_15: '§ 22-15',
  FOLKETRYGDLOVEN_22_17: '§ 22-17',
};

// En liste over hjemmler som ikke har implementert revurderinger i backend
// Denne listen kan f.eks. brukes til for å sjekke om brukes velger omgjøring
// på en av disse hjemmlene, slik at vi kan vise en feilmelding i stede for å la det
// feilge pga manglende mapping i backend
export const ikkeImplementertKlageHjemmler: Hjemmel[] = [
  'FOLKETRYGDLOVEN_11_3',
  'FOLKETRYGDLOVEN_11_4',
  'FOLKETRYGDLOVEN_11_7',
  'FOLKETRYGDLOVEN_11_8',
  'FOLKETRYGDLOVEN_11_10_MELDEPLIKT',
  'FOLKETRYGDLOVEN_11_12',
  'FOLKETRYGDLOVEN_11_14',
  'FOLKETRYGDLOVEN_11_15',
  'FOLKETRYGDLOVEN_11_23_OVERGNG_ARB',
  'FOLKETRYGDLOVEN_11_29',
  'FOLKETRYGDLOVEN_11_31',
  'FOLKETRYGDLOVEN_22_13',
  'FOLKETRYGDLOVEN_22_15',
  'FOLKETRYGDLOVEN_22_17',
];

export const hjemmelalternativer = Object.entries(hjemmelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));

export const hjemmelÅrsakMapMap: Partial<Record<Hjemmel, ÅrsakTilBehandling>> = {
  FOLKETRYGDLOVEN_11_5: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
  FOLKETRYGDLOVEN_11_6: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND',
};
