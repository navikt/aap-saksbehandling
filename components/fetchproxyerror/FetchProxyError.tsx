import { ErrorResponseBody } from 'lib/services/apiFetch';
import { Alert } from '@navikt/ds-react';

interface Props {
  error: ErrorResponseBody;
}

export const FetchProxyError = ({ error }: Props) => {
  return <Alert variant={'error'}>{error.message}</Alert>;
};
