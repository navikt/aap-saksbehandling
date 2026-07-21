'use client';

import { VStack } from '@navikt/ds-react/Stack';
import { BodyShort } from '@navikt/ds-react/Typography';
import { FetchResponse, isError } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';

interface Props {
  apiResponses: FetchResponse<unknown>[];
}
export const ApiException = ({ apiResponses }: Props) => {
  return (
    <Alert variant={'error'}>
      {apiResponses
        .filter((res) => isError(res))
        .map((feil, i) => (
          <VStack key={`feil-${i}`}>
            {feil.status >= 500 && (
              <>
                <BodyShort size={'small'}>{feil.status}</BodyShort>
                <BodyShort size={'small'}>{feil.apiException.code}</BodyShort>
              </>
            )}
            <BodyShort size={'small'}>{feil.apiException.message}</BodyShort>
          </VStack>
        ))}
    </Alert>
  );
};
