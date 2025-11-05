'use client';

import { ErrorList } from 'lib/utils/formerrors';
import { Ref, useEffect, useRef } from 'react';
import { ErrorSummary } from '@navikt/ds-react';
import { setFocusHtmlRef } from 'lib/utils/dom';

interface Props {
  errorList: ErrorList;
}
export const FormErrorSummary = ({ errorList }: Props) => {
  const errorSummaryRef: Ref<HTMLDivElement> = useRef(null);
  const isError = errorList.length > 0;

  useEffect(() => {
    if (isError) {
      setFocusHtmlRef(errorSummaryRef);
    }
  }, [isError, errorSummaryRef]);

  if (!isError) {
    return null;
  }

  return (
    <ErrorSummary size={'small'} ref={errorSummaryRef}>
      {errorList.map((error) => (
        <ErrorSummary.Item key={error.ref} href={error.ref}>
          {error?.message}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  );
};
