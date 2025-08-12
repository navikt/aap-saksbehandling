import { useParams } from 'next/navigation';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsReferanse } = useParams<{ behandlingsReferanse: string }>();
  return behandlingsReferanse;
};

export const useSaksnummer = (): string => {
  const { saksId } = useParams<{ saksId: string }>();
  return saksId;
};
