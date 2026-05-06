'use client';

import { VStack } from '@navikt/ds-react';
import { ArenaSakKort } from 'components/saksoversikt/ArenaSakKort';
import { SakerResponse } from 'lib/services/apiinternservice/apiInternService';

export function ArenaSakerListe({ arenaSaker }: { arenaSaker: SakerResponse }) {
  return (
    <VStack gap="space-32">
      {arenaSaker.saker.map((sak) => (
        <ArenaSakKort key={sak.sakId} sak={sak} />
      ))}
    </VStack>
  );
}
