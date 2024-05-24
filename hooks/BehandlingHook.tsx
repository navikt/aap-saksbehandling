import { useParams } from 'next/navigation';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsReferanse } = useParams<{ behandlingsReferanse: string }>();
  return behandlingsReferanse;
};
