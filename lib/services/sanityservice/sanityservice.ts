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

const brevmalQuery = groq`*[_type=='brev']{
  brevtittel,
  innhold[] -> {
    _type,
    _id,
    _type == 'systeminnhold' => {
      systemNokkel,
      overskrift,
      "niva": niva->.level
    },
    _type == 'standardtekst' => {
      overskrift,
      "niva": niva->.level,
      kanRedigeres,
        innhold[]{
        _type == 'content' => {
          ...,
          children[] {
            ...,
            _type == 'systemVariabel' => {
              ...,
              "systemVariabel": @->.tekniskNavn
            },
            _type == 'inlineElement' => {
              ...,
              "text": @->.tekst
            },
          }
        }
      }
    }
  }
}`;

export async function hentBrevmalerFraSanity() {
  const brevmaler = await sanityservice.fetch<Array<Brevmal>>(brevmalQuery);
  return brevmaler;
}
