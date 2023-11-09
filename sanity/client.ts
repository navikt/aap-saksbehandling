import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-09',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
