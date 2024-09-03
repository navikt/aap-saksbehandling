import { ReadMore } from '@navikt/ds-react';
import { ReactNode } from 'react';

interface Props {
  tekst?: ReactNode;
  header?: string;
  defaultOpen?: boolean;
}

export const Veiledning = ({
  tekst = 'Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes',
  header = 'Slik vurderes vilkåret',
  defaultOpen = true,
}: Props) => {
  return (
    <ReadMore header={header} defaultOpen={defaultOpen} size={'small'}>
      {tekst}
    </ReadMore>
  );
};
