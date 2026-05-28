'use client';

import { HStack, Link } from '@navikt/ds-react';
import { EksternLenkeIVilkårskort } from 'lib/types/types';

export const EksterneLenker = ({ lenker }: { lenker: EksternLenkeIVilkårskort[] }) => (
  <HStack gap="space-8">
    <ul>
      {lenker.map((lenke, index) => (
        <li key={index}>
          <Link inlineText={true} href={lenke.url} target="_blank" rel="noopener noreferrer">
            {lenke.lenkeTekst}
          </Link>
        </li>
      ))}
    </ul>
  </HStack>
);
