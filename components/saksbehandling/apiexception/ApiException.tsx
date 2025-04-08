'use client';

import { FetchResponse } from 'lib/services/apiFetch';
import { Alert, BodyShort, VStack } from '@navikt/ds-react';

interface Props {
  apiResponses: FetchResponse<unknown>[];
}
export const ApiException = ({ apiResponses }: Props) => {
  return (
    <Alert variant={'error'}>
      {apiResponses
        .filter((e) => e.type === 'ERROR')
        .map((e) => e.apiException)
        .map((feil, i) => (
          <VStack key={`feil-${i}`}>
            <BodyShort>{feil.status}</BodyShort>
            <BodyShort>{feil.code}</BodyShort>
            <BodyShort>{feil.message}</BodyShort>
          </VStack>
        ))}
    </Alert>
  );
};
