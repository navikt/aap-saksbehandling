import { useParams } from 'next/navigation';

type BehandlingParams = {
  aktivGruppe: string;
  behandlingsreferanse: string;
  saksnummer: string;
};

export const useParamsMedType = () => {
  return useParams<BehandlingParams>();
};
