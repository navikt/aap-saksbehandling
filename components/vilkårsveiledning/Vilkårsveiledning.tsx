import { ReadMore } from '@navikt/ds-react';

interface Props {
  tekst?: string;
}

export const Vilkårsveildening = ({
  tekst = 'Her kommer det noe tekst som beskriver hvordan vilkåret skal vurderes',
}: Props) => {
  return (
    <ReadMore header={'Slik vurderes vilkåret'} defaultOpen={true} size={'small'}>
      {tekst}
    </ReadMore>
  );
};
