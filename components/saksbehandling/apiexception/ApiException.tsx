'use client';

import { BodyShort, VStack } from '@navikt/ds-react';
import { FetchResponse, isError } from 'lib/utils/api';
import { KelvinAlert } from 'components/alert/KelvinAlert';

interface Props {
  apiResponses: FetchResponse<unknown>[];
}
export const ApiException = ({ apiResponses }: Props) => {
  return (
    <KelvinAlert variant={'error'}>
      {apiResponses
        .filter((res) => isError(res))
        .map((feil, i) => (
          <VStack key={`feil-${i}`}>
            <BodyShort size={'small'}>{feil.status}</BodyShort>
            <BodyShort size={'small'}>{feil.apiException.code}</BodyShort>
            <BodyShort size={'small'}>{feil.apiException.message}</BodyShort>
          </VStack>
        ))}
    </KelvinAlert>
  );
};
