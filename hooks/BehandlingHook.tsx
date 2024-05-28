import { useParams } from 'next/navigation';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsReferanse } = useParams<{ behandlingsReferanse: string }>();

  if (!behandlingsReferanse) {
    throw Error('Kunne ikke finne påkrevd behandlingsreferanse');
  }

  return behandlingsReferanse;
};
