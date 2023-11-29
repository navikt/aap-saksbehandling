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

export interface Brevmal {
  brevtittel: string;
  innhold: Innhold[];
}

const brevmalQuery = groq`
*[_type=='brev']{
  brevtittel,
  innhold[] -> {
    _type,
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
            _type == 'blockElement' => {
              ...,
              'innhold': @->.innhold
            }
          }
        }
      }
    }
  }`;

export async function hentBrevmalerFraSanity() {
  return await sanityservice.fetch<Array<Brevmal>>(brevmalQuery);
}
