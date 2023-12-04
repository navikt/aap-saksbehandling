import { createClient, groq } from 'next-sanity';
import { PortableText } from 'lib/utils/sanity';

export const sanityservice = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-09',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export type Nivå = 'H1' | 'H2' | 'H3';

interface Innhold {
  _id: string;
  overskrift?: string;
  niva?: Nivå;
}

export interface StandardTekst extends Innhold {
  innhold: PortableText[];
  kanRedigeres: boolean;
  _type: 'standardtekst';
}

export interface Systeminnhold extends Innhold {
  _type: 'systeminnhold';
  systemNokkel: string;
}

export interface Brevmal {
  brevtittel: string;
  innhold: StandardTekst[] | Systeminnhold[];
}

export interface Brevmaler {
  brevtittel: string;
  brevtype: string;
  _id: string;
}

export function hentAlleBrevmaler() {
  return sanityservice.fetch<Array<Brevmaler>>(groq`
*[_type=='brev']{
  brevtittel,
    _id,
    brevtype
  }`);
}
