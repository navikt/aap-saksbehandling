import { createClient } from 'next-sanity';
import { PortableText } from 'lib/utils/sanity';

export const sanityservice = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-09',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface Tekster {
  innhold: PortableText[];
}

interface Brevmal {
  brevtype: string;
  vilkarsvurderinger?: Tekster[];
  standardtekster?: Tekster[];
}

export async function hentBrevmalerFraSanity() {
  return await sanityservice.fetch<Array<Brevmal>>(
    '*[_type == "brev"]{brevtype, standardtekster [] -> {innhold}, vilkarsvurderinger [] -> {innhold}}'
  );
}
