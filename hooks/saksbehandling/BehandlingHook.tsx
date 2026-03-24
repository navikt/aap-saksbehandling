import { useParams } from 'next/navigation';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsReferanse } = useParams<{ behandlingsReferanse: string }>();
  return behandlingsReferanse;
};

export const useSaksnummer = (): string => {
  const { saksnummer } = useParams<{ saksnummer: string }>();
  return saksnummer;
};
