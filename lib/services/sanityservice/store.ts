import * as queryStore from '@sanity/react-loader';
import { client } from 'lib/services/sanityservice/client';

// Sanity client for overlay preview

queryStore.setServerClient(client.withConfig({ token: process.env.SANITY_API_TOKEN }));

export const { loadQuery } = queryStore;
