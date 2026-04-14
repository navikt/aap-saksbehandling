import { useParams } from 'next/navigation';

export const useParamsMedType = () => {
  const params = useParams<{ aktivGruppe: string; behandlingsreferanse: string; saksnummer: string }>();

  return {
    ...params,
  };
};
