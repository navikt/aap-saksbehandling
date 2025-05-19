'use client';

import useSWR from 'swr';
import { clientHentBrukerInformasjon } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';

export function useNavIdent() {
  const { data } = useSWR('api/bruker', clientHentBrukerInformasjon);

  if (isSuccess(data)) {
    return data.data.NAVident;
  } else {
    return 'Ukjent';
  }
}
