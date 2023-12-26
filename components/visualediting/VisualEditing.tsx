'use client';

import { client } from 'lib/services/sanityservice/client';
import { useEffect } from 'react';
import { useLiveMode } from '@sanity/react-loader';
import { enableOverlays } from '@sanity/overlays';

const stegaClient = client.withConfig({ stega: true });

export const VisualEditing = () => {
  useEffect(() => {
    enableOverlays();
  }, []);

  useLiveMode({ client: stegaClient });
  return null;
};
