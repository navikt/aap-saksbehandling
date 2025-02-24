import React from 'react';
import { Alert } from '@navikt/ds-react';
import { ErrorResponseBody } from 'lib/services/fetchProxy';

interface Props {
  error: ErrorResponseBody;
}

export const FetchProxyError = ({ error }: Props) => {
  return <Alert variant={'error'}>{error.message}</Alert>;
};
