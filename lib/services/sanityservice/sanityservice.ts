import { createClient, groq } from 'next-sanity';
import { Brevmaler } from 'lib/utils/sanity';

export const sanityservice = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-09',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export function hentAlleBrevmaler() {
  return sanityservice.fetch<Array<Brevmaler>>(groq`
*[_type=='brev']{
  brevtittel,
    _id,
    brevtype
  }`);
}
