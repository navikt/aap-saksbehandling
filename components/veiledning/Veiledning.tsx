import { ReadMore } from '@navikt/ds-react';

interface Props {
  tekst?: string;
  header?: string;
}

export const Veiledning = ({
  tekst = 'Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes',
  header = 'Slik vurderes vilkåret',
}: Props) => {
  return (
    <ReadMore header={header} defaultOpen={true} size={'small'}>
      {tekst}
    </ReadMore>
  );
};
