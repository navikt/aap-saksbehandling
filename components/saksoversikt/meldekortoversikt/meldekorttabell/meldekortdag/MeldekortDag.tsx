import { VStack } from '@navikt/ds-react';
import { Dag } from 'components/saksoversikt/meldekortoversikt/meldekortTypes';

interface Props {
  dager: Dag[];
}

export const MeldekortDag = ({ dager }: Props) => {
  return (
    <VStack gap={'2'}>
      {dager.map((dag, index) => (
        <span key={index}>{dag.timerArbeidet}</span>
      ))}
    </VStack>
  );
};
