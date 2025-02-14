'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useSearchParams } from 'next/navigation';

export default function ForbiddenPage() {
  const params = useSearchParams();
  const url = params.get('url');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBlockStart: '2rem',
      }}
    >
      <Heading level="2" size="medium" spacing>
        ❌ Oi! Her har du ikke tilgang
      </Heading>
      <VStack align={'center'}>
        <BodyShort spacing>Gå til oppgavelisten for å se oppgaver du har tilgang til. Url: {url}</BodyShort>
      </VStack>
    </div>
  );
}
