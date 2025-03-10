'use client';

import { VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { Enhet, Kø } from 'lib/types/oppgaveTypes';

interface Props {
  køer: Kø[];
  enheter: Enhet[];
  valgtFilterId: number;
}
export const EndreKø = ({ køer, valgtFilterId }: Props) => {
  const [aktivKøId, setAktivKøId] = useState<number>(valgtFilterId);
  const aktivKø = useMemo(() => køer.find((kø) => kø.id === aktivKøId), [aktivKøId, køer]);
  console.log(aktivKø);

  return (
    <VStack>
      <KøSelect køer={køer} valgtKøListener={setAktivKøId} defaultAktivKøId={valgtFilterId} />
    </VStack>
  );
};
