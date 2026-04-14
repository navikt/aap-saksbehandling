import { BekreftVurderingerOppfølgingGrunnlag } from 'lib/types/types';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { clientHentBekreftVurderingerOppfølgingGrunnlag } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';

export function useBekreftVurderingerGrunnlag(initialGrunnlag?: BekreftVurderingerOppfølgingGrunnlag): {
  grunnlag?: BekreftVurderingerOppfølgingGrunnlag;
  refetchBekreftVurderingerGrunnlagClient: () => void;
} {
  const params = useParams<{ behandlingsreferanse: string }>();

  if (!params.behandlingsreferanse) {
    throw Error('useBekreftVurderinger kan bare brukes på behandlingssiden.');
  }

  const { data, mutate } = useSWR(
    `api/grunnlag/${params.behandlingsreferanse}/bekreftvurderinger`,
    () => clientHentBekreftVurderingerOppfølgingGrunnlag(params.behandlingsreferanse),
    {
      fallbackData: initialGrunnlag && {
        type: 'SUCCESS',
        data: initialGrunnlag,
      },
    }
  );

  return {
    grunnlag: isSuccess(data) ? data?.data : undefined,
    refetchBekreftVurderingerGrunnlagClient: mutate,
  };
}
