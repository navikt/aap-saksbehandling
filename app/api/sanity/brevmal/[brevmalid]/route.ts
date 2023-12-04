import { NextRequest } from 'next/server';
import { Brevmal, sanityservice } from 'lib/services/sanityservice/sanityservice';
import { groq } from 'next-sanity';

export async function GET(req: NextRequest, { params }: { params: { brevmalid: string } }) {
  const data = await sanityservice.fetch<Brevmal>(groq`*[_id == "${params.brevmalid}"][0]{
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
}`);

  return new Response(JSON.stringify(data), { status: 200 });
}
