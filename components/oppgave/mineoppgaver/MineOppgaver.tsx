'use client';

import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import useSWR from 'swr';
import { hentMineOppgaverClient } from 'lib/oppgaveClientApi';
import { Alert, BodyShort, Skeleton, VStack } from '@navikt/ds-react';
import { isError, isSuccess } from 'lib/utils/api';

export const MineOppgaver = () => {
  const { data: mineOppgaver, mutate } = useSWR(`api/mine-oppgaver`, () => hentMineOppgaverClient());
  return (
    <>
      {isError(mineOppgaver) && (
        <Alert
          variant={'error'}
          title={'Feil'}
        >{`Status ${mineOppgaver.status}, msg: ${mineOppgaver.apiException.message}`}</Alert>
      )}
      {isSuccess(mineOppgaver) && !mineOppgaver.data?.oppgaver?.length && (
        <BodyShort>Ingen reserverte oppgaver</BodyShort>
      )}
      {!isSuccess(mineOppgaver) && !isError(mineOppgaver) && (
        <VStack gap={'7'}>
          <VStack gap={'1'}>
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
          </VStack>
          <VStack gap={'1'}>
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
          </VStack>
        </VStack>
      )}
      {isSuccess(mineOppgaver) && (
        <OppgaveTabell
          oppgaver={mineOppgaver.data.oppgaver}
          visBehandleOgFrigiKnapp
          showDropdownActions
          showSortAndFilters
          revalidateFunction={mutate}
        />
      )}
    </>
  );
};
