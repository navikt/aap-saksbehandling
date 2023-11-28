import { createClient } from 'next-sanity';
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

export async function hentBrevmalerFraSanity() {
  return await sanityservice.fetch<Array<Brevmal>>(
    "*[_type=='brev']{\n" +
      '  brevtittel,\n' +
      '  innhold[] -> {\n' +
      '    _type,\n' +
      '      innhold[]{\n' +
      "        _type == 'content' => {\n" +
      '          ...,\n' +
      '          children[] {\n' +
      '            ...,\n' +
      "            _type == 'systemVariabel' => {\n" +
      '              ...,\n' +
      '              "systemVariabel": @->.tekniskNavn\n' +
      '            },\n' +
      "            _type == 'inlineElement' => {\n" +
      '              ...,\n' +
      '              "text": @->.tekst\n' +
      '            },\n' +
      "            _type == 'blockElement' => {\n" +
      '              ...,\n' +
      "              'innhold': @->.innhold\n" +
      '              \n' +
      '            }\n' +
      '          }\n' +
      '        }\n' +
      '      }\n' +
      '    }\n' +
      '  }'
  );
}
