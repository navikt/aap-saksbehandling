import { OppgaveKøMedOppgaver } from 'components/oppgave/oppgavekømedoppgaver/OppgaveKøMedOppgaver';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import { VStack } from '@navikt/ds-react';
import { hentEnheter, hentMineOppgaver } from 'lib/services/oppgaveservice/oppgaveservice';
import { Kort } from 'components/oppgave/kort/Kort';

const Page = async () => {
  const enheter = await hentEnheter();
  const mineOppgaver = await hentMineOppgaver();
  return (
    <VStack gap={'4'} padding={'4'}>
      <Kort>
        <OppgaveTabell
          heading={'Mine reserverte oppgaver'}
          oppgaver={mineOppgaver.oppgaver || []}
          visBehandleOgFrigiKnapp
          showDropdownActions
          showSortAndFilters
        />
      </Kort>
      <OppgaveKøMedOppgaver enheter={enheter} />
    </VStack>
  );
};

export default Page;
