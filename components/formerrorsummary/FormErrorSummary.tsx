'use client';

import { ErrorList } from 'lib/utils/formerrors';
import { ErrorSummary } from '@navikt/ds-react';

interface Props {
  errorList: ErrorList;
}

export const FormErrorSummary = ({ errorList }: Props) => {
  const isError = errorList.length > 0;

  if (!isError) {
    return null;
  }

  return (
    <ErrorSummary size={'small'}>
      {errorList.map((error) => (
        <ErrorSummary.Item key={error.ref} href={error.ref}>
          {error?.message}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  );
};
