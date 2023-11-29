import { createClient, groq } from 'next-sanity';
import { PortableText } from 'lib/utils/sanity';

export const sanityservice = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-09',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface Innhold {
  innhold: PortableText[];
  _type: string;
}

interface Systeminnhold {
  _type: string;
  systemNokkel: string;
  overskrift?: string;
}

export interface Brevmal {
  brevtittel: string;
  innhold: Innhold[] | Systeminnhold;
}

const brevmalQuery = groq`
*[_type=='brev']{
  brevtittel,
  innhold[] -> {
    _type,
    _type == 'systeminnhold' => {
      systemNokkel,
      overskrift
    },
    _type == 'standardtekst' => {
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
