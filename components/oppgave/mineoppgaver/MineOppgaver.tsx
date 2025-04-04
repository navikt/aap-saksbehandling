'use client';

import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import useSWR from 'swr';
import { hentMineOppgaverClient } from 'lib/oppgaveClientApi';
import { Alert, BodyShort, Skeleton, VStack } from '@navikt/ds-react';
import { Kort } from 'components/oppgave/kort/Kort';

export const MineOppgaver = () => {
  const mineOppgaver = useSWR(`api/mine-oppgaver`, () => hentMineOppgaverClient());
  return (
    <>
      {mineOppgaver?.data?.type === 'error' && (
        <Alert
          variant={'error'}
          title={'Feil'}
        >{`Status ${mineOppgaver?.data?.status}, msg: ${mineOppgaver?.data?.message}`}</Alert>
      )}
      {mineOppgaver?.data?.type === 'success' && !mineOppgaver?.data?.data?.oppgaver?.length && (
        <BodyShort>Ingen reserverte oppgaver</BodyShort>
      )}
      {mineOppgaver?.data?.type !== 'success' && mineOppgaver?.data?.type !== 'error' && (
        <Kort>
          <VStack gap={'1'}>
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
          </VStack>
        </Kort>
      )}
      {mineOppgaver?.data?.type === 'success' && (
        <OppgaveTabell
          oppgaver={mineOppgaver.data.data.oppgaver}
          visBehandleOgFrigiKnapp
          showDropdownActions
          showSortAndFilters
        />
      )}
    </>
  );
};
