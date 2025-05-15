const hjemmelMap = {
  FOLKETRYGDLOVEN_11_5: '$ 11-5',
  FOLKETRYGDLOVEN_11_6: '$ 11-6',
};

export const hjemmelalternativer = Object.entries(hjemmelMap).map(([k, v]) => ({
  value: k,
  label: v,
}));
