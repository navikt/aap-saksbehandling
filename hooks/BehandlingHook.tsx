import { useParams } from 'next/navigation';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import useSWR from 'swr';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsReferanse } = useParams<{ behandlingsReferanse: string }>();
  if (!behandlingsReferanse) {
    throw Error('Kunne ikke finne påkrevd behandlingsreferanse');
  }

  return behandlingsReferanse;
};

export const useFlyt = (): {
  data: BehandlingFlytOgTilstand | undefined;
  mutate: () => Promise<BehandlingFlytOgTilstand | undefined>;
  isLoading: boolean;
} => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { data, isLoading, mutate } = useSWR(`/api/behandling/${behandlingsReferanse}/flyt`);

  return { data, isLoading, mutate };
};

export const useRequiredBehandlingVersjon = (): number => {
  const { data } = useFlyt();

  if (!data?.behandlingVersjon) {
    throw Error('Påkrevd behandlingversjon ikke funnet');
  }

  return data.behandlingVersjon;
};
