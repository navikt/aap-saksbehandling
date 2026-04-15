import { useParams } from 'next/navigation';

export const useBehandlingsReferanse = (): string => {
  const { behandlingsreferanse } = useParams<{ behandlingsreferanse: string }>();
  return behandlingsreferanse;
};

export const useSaksnummer = (): string => {
  const { saksnummer } = useParams<{ saksnummer: string }>();
  return saksnummer;
};

export const useBehandlingsreferanseOgSaksnummer = () => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const saksnummer = useSaksnummer();

  return { behandlingsreferanse, saksnummer };
};
