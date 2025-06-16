'use client';

import { useEffect, useState, useTransition } from 'react';
import useSWR from 'swr';
import { BodyShort, Box, Button, HStack, Label, Skeleton, Switch, VStack } from '@navikt/ds-react';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { byggKelvinURL, queryParamsArray } from 'lib/utils/request';
import { Enhet } from 'lib/types/oppgaveTypes';
import { hentKøerForEnheterClient, plukkNesteOppgaveClient } from 'lib/oppgaveClientApi';
import { useLagreAktivKøId } from 'lib/utils/aktivkøid';
import { useRouter } from 'next/navigation';
import { useLagreAktivEnhet } from 'lib/utils/aktivEnhet';
import { isError, isSuccess } from 'lib/utils/api';
import { useLedigeOppgaver } from 'hooks/oppgave/OppgaveHook';
import { LedigeOppgaverTabell } from 'components/oppgaveliste/ledigeoppgaver/ledigeoppgavertabell/LedigeOppgaverTabell';

interface Props {
  enheter: Enhet[];
}

export const LedigeOppgaver = ({ enheter }: Props) => {
  const { lagreAktivEnhet, hentLagretAktivEnhet } = useLagreAktivEnhet();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const [aktivKøId, setAktivKøId] = useState<number>();
  const { hentLagretAktivKøId, lagreAktivKøId } = useLagreAktivKøId();

  const { antallOppgaver, oppgaver, size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver, mutate } =
    useLedigeOppgaver([aktivEnhet], veilederFilter === 'veileder', aktivKøId);

  const { data: køer } = useSWR(`api/filter?${queryParamsArray('enheter', [aktivEnhet])}`, () =>
    hentKøerForEnheterClient([aktivEnhet])
  );

  const oppdaterKøId = (id: number) => {
    setAktivKøId(id);
    lagreAktivKøId(id);
  };

  const oppdaterEnhet = (enhetsnr: string) => {
    setAktivEnhet(enhetsnr);
    lagreAktivEnhet(enhetsnr);
  };

  useEffect(() => {
    if (!køer || (køer && isError(køer))) {
      return;
    }
    const køId = hentLagretAktivKøId();
    const gyldigeKøer = køer.data.map((kø) => kø.id);

    if (!køId || !gyldigeKøer.includes(køId)) {
      oppdaterKøId(gyldigeKøer[0] ?? 0);
    } else {
      oppdaterKøId(køId);
    }
  }, [køer]);

  async function plukkOgGåTilOppgave() {
    startTransition(async () => {
      if (aktivEnhet && aktivKøId) {
        const nesteOppgaveRes = await plukkNesteOppgaveClient(aktivKøId, aktivEnhet);
        if (isSuccess(nesteOppgaveRes)) {
          router.push(byggKelvinURL(nesteOppgaveRes.data.avklaringsbehovReferanse));
        }
      }
    });
  }

  const oppgaveKøer = isSuccess(køer) ? køer.data : undefined;

  return (
    <VStack gap={'5'}>
      <Box background="surface-subtle" padding="4" borderRadius="xlarge">
        <VStack gap={'5'}>
          <HStack justify={'space-between'} align={'end'}>
            <HStack gap={'4'}>
              <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} valgtEnhetListener={oppdaterEnhet} />
              <KøSelect
                label={'Velg kø'}
                køer={oppgaveKøer || []}
                aktivKøId={aktivKøId}
                valgtKøListener={oppdaterKøId}
              />
              <VStack justify={'end'}>
                <Switch
                  value="veileder"
                  checked={veilederFilter === 'veileder'}
                  onChange={(e) => setVeilederFilter((prevState) => (prevState ? '' : e.target.value))}
                  size={'small'}
                >
                  Vis kun oppgaver jeg er veileder på
                </Switch>
              </VStack>
            </HStack>
            <VStack justify={'center'}>
              <Button size="small" onClick={() => plukkOgGåTilOppgave()} loading={isPending}>
                Behandle neste oppgave
              </Button>
            </VStack>
          </HStack>
          <HStack style={{ borderBottom: '1px solid #071A3636' }}></HStack>
          <HStack gap={'4'}>
            <VStack>
              <Label as="p" size={'small'}>
                Beskrivelse av køen
              </Label>
              <BodyShort>{oppgaveKøer?.find((e) => e.id === aktivKøId)?.beskrivelse}</BodyShort>
            </VStack>
            <VStack>
              <Label as="p" size={'small'}>
                Totalt antall oppgaver
              </Label>
              <BodyShort>{antallOppgaver}</BodyShort>
            </VStack>
          </HStack>
        </VStack>
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

      {!isLoading && !oppgaver?.length && <BodyShort>Ingen oppgaver i valgt kø for valgt enhet</BodyShort>}

      {oppgaver && oppgaver.length > 0 && <LedigeOppgaverTabell oppgaver={oppgaver} revalidateFunction={mutate} />}

      {kanLasteInnFlereOppgaver && (
        <HStack justify={'center'}>
          <Button
            onClick={async () => {
              await setSize(size + 1);
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
