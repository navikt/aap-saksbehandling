export type KodeverkBeskrivelse = {
  term: string;
  tekst: string;
};

export type KodeverkBetydning = {
  gyldigFra: string;
  gyldigTil: string;
  beskrivelser: Record<string, KodeverkBeskrivelse>;
};

export type KodeverkResponse = {
  betydninger: Record<string, KodeverkBetydning[]>;
};
