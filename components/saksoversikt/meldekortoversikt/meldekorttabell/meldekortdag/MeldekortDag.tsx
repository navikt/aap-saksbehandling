import { VStack } from '@navikt/ds-react';
import { DagFraBackend } from 'components/saksoversikt/meldekortoversikt/meldekortTypes';

interface Props {
  dager: DagFraBackend[];
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
