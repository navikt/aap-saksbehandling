import { BehandlingsflytEllerPostmottakBehandling } from 'components/saksoversikt/types';
import { postmottakAlleBehandlinger } from 'lib/postmottakClientApi';
import useSWR from 'swr';

export function usePostmottakBehandlinger(ident: string): BehandlingsflytEllerPostmottakBehandling[] {
  const { data: postmottakBehandlinger } = useSWR(
    `alle-behandlinger-${ident}`,
    () => postmottakAlleBehandlinger(ident),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  return postmottakBehandlinger?.type === 'SUCCESS'
    ? postmottakBehandlinger.data.behandlinger.map((behandling) => ({ kilde: 'POSTMOTTAK', behandling: behandling }))
    : [];
}
