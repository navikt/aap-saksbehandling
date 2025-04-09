'use client';

import { FetchResponse } from 'lib/services/apiFetch';
import { Alert, BodyShort, VStack } from '@navikt/ds-react';

interface Props {
  apiResponses: FetchResponse<unknown>[];
}
export const ApiException = ({ apiResponses }: Props) => {
  return (
    <Alert variant={'error'} size={'small'}>
      {apiResponses
        .filter((e) => e.type === 'ERROR')
        .map((e) => e.apiException)
        .map((feil, i) => (
          <VStack key={`feil-${i}`}>
            <BodyShort size={'small'}>{feil.status}</BodyShort>
            <BodyShort size={'small'}>{feil.kelvinException.code}</BodyShort>
            <BodyShort size={'small'}>{feil.kelvinException.message}</BodyShort>
          </VStack>
        ))}
    </Alert>
  );
};
