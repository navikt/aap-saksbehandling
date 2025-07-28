'use client';

import { Enhet } from 'lib/types/oppgaveTypes';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { useEffect, useState } from 'react';
import { useLagreAktivEnhet } from 'hooks/oppgave/aktivEnhetHook';
import { BodyShort, Box, Button, HStack, Skeleton, VStack } from '@navikt/ds-react';
import { AlleOppgaverTabell } from 'components/oppgaveliste/alleoppgaver/alleoppgavertabell/AlleOppgaverTabell';
import { useAlleOppgaverForEnhet } from 'hooks/oppgave/OppgaveHook';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { isError, isSuccess } from 'lib/utils/api';
import useSWR from 'swr';
import { queryParamsArray } from 'lib/utils/request';
import { hentKøerForEnheterClient } from 'lib/oppgaveClientApi';
import { useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';

interface Props {
  enheter: Enhet[];
}

export const AlleOppgaver = ({ enheter }: Props) => {
  const { hentLagretAktivEnhet, lagreAktivEnhet } = useLagreAktivEnhet();
  const { hentLagretAktivKø, lagreAktivKøId } = useLagreAktivKø();

  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const [aktivKøId, setAktivKøId] = useState<number>();

  const { data: køer } = useSWR(`api/filter?${queryParamsArray('enheter', [aktivEnhet])}`, () =>
    hentKøerForEnheterClient([aktivEnhet])
  );

  useEffect(() => {
    if (!køer || (køer && isError(køer))) {
      return;
    }
    const køId = hentLagretAktivKø();
    const gyldigeKøer = køer.data.map((kø) => kø.id);

    if (!køId || !gyldigeKøer.includes(køId)) {
      oppdaterKøId(gyldigeKøer[0] ?? 0);
    } else {
      oppdaterKøId(køId);
    }
  }, [køer]);

  const oppdaterEnhet = (enhetsnr: string) => {
    setAktivEnhet(enhetsnr);
    lagreAktivEnhet(enhetsnr);
  };

  const oppdaterKøId = (id: number) => {
    setAktivKøId(id);
    lagreAktivKøId(id);
  };

  const { oppgaver, size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver, mutate } =
    useAlleOppgaverForEnhet([aktivEnhet], aktivKøId);

  const oppgaveKøer = isSuccess(køer) ? køer.data : undefined;

  return (
    <VStack gap={'4'}>
      <Box background="surface-subtle" padding="4" borderRadius="xlarge">
        <HStack gap={'4'}>
          <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} valgtEnhetListener={oppdaterEnhet} />
          <KøSelect label={'Velg kø'} køer={oppgaveKøer || []} aktivKøId={aktivKøId} valgtKøListener={oppdaterKøId} />
        </HStack>
      </Box>

      {isLoading && (
        <VStack gap={'1'}>
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
        </VStack>
      )}

      {!isLoading && oppgaver && oppgaver.length === 0 && <BodyShort>Ingen oppgaver for enhet {aktivEnhet}</BodyShort>}

      {oppgaver && oppgaver.length > 0 && <AlleOppgaverTabell oppgaver={oppgaver} revalidateFunction={mutate} />}

      {kanLasteInnFlereOppgaver && (
        <HStack justify={'center'}>
          <Button
            onClick={async () => {
              setSize(size + 1);
            }}
            variant={'secondary'}
            className={'fit-content'}
            size={'small'}
            loading={isValidating}
          >
            Last inn flere
          </Button>
        </HStack>
      )}
    </VStack>
  );
};
