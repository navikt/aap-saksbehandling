'use client';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useSearchParams } from 'next/navigation';

/**
 * Erstatning frem til denne er ut av experimental og klar for produksjon
 * https://nextjs.org/docs/app/api-reference/file-conventions/forbidden
 */
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
        <BodyShort weight={'semibold'} spacing>
          Url: {url}
        </BodyShort>
        <BodyShort spacing>Gå til oppgavelisten for å se oppgaver du har tilgang til.</BodyShort>
      </VStack>
    </div>
  );
}
