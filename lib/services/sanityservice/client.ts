import { createClient } from '@sanity/client/stega';

export const STUDIO_ORIGIN = 'http://localhost:3333';
export const STEGA_ENABLED = true;

export const client = createClient({
  projectId: '948n95rd',
  dataset: 'production',
  apiVersion: '2023-11-01',
  useCdn: true,
  perspective: 'published',

  stega: {
    enabled: STEGA_ENABLED,
    studioUrl: STUDIO_ORIGIN,
  },
});
