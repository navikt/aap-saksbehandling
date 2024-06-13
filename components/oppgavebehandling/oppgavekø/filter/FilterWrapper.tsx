import { useSearchParams } from 'next/navigation';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';

export const FilterWrapper = () => {
  const searchParams = useSearchParams();
  const erAvdelingsleder = searchParams.get('erAvdelingsleder') === 'true';
  return <Filter erAvdelingsleder={erAvdelingsleder} />;
};
