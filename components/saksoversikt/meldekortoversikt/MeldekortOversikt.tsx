import { Heading, VStack } from '@navikt/ds-react';
import { MeldekortTabell } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';
import { DagFraBackend, Meldekort } from 'components/saksoversikt/meldekortoversikt/meldekortTypes';
import { formaterDatoForBackend } from 'lib/utils/date';

const meldekort1: Meldekort = {
  dager: generateTwoWeekPeriod(new Date('2026-03-16')),
  fraværTotaltIMeldeperiode: 0,
  meldekortId: 'hello-pello',
  meldeperiode: {
    fom: '2026-03-16',
    tom: '2026-03-29',
  },
};

const meldekort2: Meldekort = {
  dager: generateTwoWeekPeriod(new Date('2026-03-30')),
  fraværTotaltIMeldeperiode: 0,
  meldekortId: 'hello-fello',
  meldeperiode: {
    fom: '2026-03-30',
    tom: '2026-04-12',
  },
};

export const MeldekortOversikt = () => {
  return (
    <VStack gap={'4'}>
      <Heading size="large">Meldekort</Heading>
      <MeldekortTabell meldekort={[meldekort1, meldekort2]} />
    </VStack>
  );
};

// Kun for test
function generateTwoWeekPeriod(startMonday: Date): DagFraBackend[] {
  return Array.from({ length: 14 }).map((_, i) => {
    const currentDate = new Date(startMonday);
    currentDate.setDate(currentDate.getDate() + i);

    const isZero = Math.random() < 0.75;

    return {
      dato: formaterDatoForBackend(currentDate),
      timerArbeidet: isZero ? 0 : Math.floor(Math.random() * 9),
    };
  });
}
