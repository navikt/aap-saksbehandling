// Typene er manuelt mappet ut fra Sanity da typen som genereres fra groq-en er
// vanskelig å bruke når man skal dele opp ting i komponenter
// TODO vurder om denne skal fjernes fra groq-en
interface SanitySystemType {
  base: {
    id: string;
    rev: string;
  };
}

// TODO vurder om vi trenger alle attributes her
interface SanityAttributes {
  _createdAt: string;
  _id: string;
  _originalId: string;
  _rev: string;
  _system?: SanitySystemType;
  _type: Innholdstype;
  _updatedAt: string;
}

type Innholdstype = 'mal' | 'delmal' | 'valg' | 'tekst';

export interface TekstinnholdType {
  _key: string;
  _type: 'span';
  marks: any[];
  text: string;
}

export interface TextEditorType {
  _id?: string | null;
  _key: string;
  _type: 'block';
  children: TekstinnholdType[];
  markDefs: any[];
  style: string;
}

export interface TekstType extends SanityAttributes {
  beskrivelse: string;
  teksteditor: TextEditorType[];
}

export interface BetingetTekstType {
  _key: string;
  _type: 'betingetTekstRef';
  kategorier: string | null;
  tekst: TekstType;
}

export interface KategorisertTekstRef {
  _key: string;
  _type: 'kategorisertTekstRef';
  kategori: string | null;
  tekst: TekstType;
}

export interface FritekstType {
  _key: string;
  _type: 'fritekst';
  fritekst: string;
}

export interface ValgType extends SanityAttributes {
  alternativer: (FritekstType | KategorisertTekstRef)[];
  beskrivelse: string;
}

export interface ValgRef {
  _key: string;
  _type: 'valgRef';
  obligatorisk: boolean;
  valg: ValgType;
}

export type EditorTypes = BetingetTekstType | TextEditorType | ValgRef | FritekstType;

export interface DelmalType extends SanityAttributes {
  beskrivelse: string;
  overskrift?: string | null;
  paragraf?: string;
  teksteditor: EditorTypes[];
}

export interface DelmalReferanse {
  _key: string;
  _type: 'delmalRef';
  delmal: DelmalType;
  obligatorisk: boolean;
}

export interface BrevmalType extends SanityAttributes {
  beskrivelse: string;
  overskrift: string;
  journalposttittel: string;
  kanSendesAutomatisk: boolean;
  delmaler: DelmalReferanse[];
}
