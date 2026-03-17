import { BekreftVurderingerOppfølgingGrunnlag } from 'lib/types/types';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { clientHentBekreftVurderingerOppfølgingGrunnlag } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';

export function useBekreftVurderingerGrunnlag(initialGrunnlag?: BekreftVurderingerOppfølgingGrunnlag): {
  grunnlag?: BekreftVurderingerOppfølgingGrunnlag;
  refetchBekreftVurderingerGrunnlagClient: () => void;
} {
  const params = useParams<{ behandlingsReferanse: string }>();

  if (!params.behandlingsReferanse) {
    throw Error('useBekreftVurderinger kan bare brukes på behandlingssiden.');
  }

  const { data, mutate } = useSWR(
    `api/grunnlag/${params.behandlingsReferanse}/bekreftvurderinger`,
    () => clientHentBekreftVurderingerOppfølgingGrunnlag(params.behandlingsReferanse),
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
