'use client';

import { useEffect, useState, useTransition } from 'react';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import useSWR from 'swr';
import { Alert, BodyShort, Box, Button, HStack, Label, Skeleton, Switch, VStack } from '@navikt/ds-react';
import { EnhetSelect } from 'components/oppgave/enhetselect/EnhetSelect';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { byggKelvinURL, queryParamsArray } from 'lib/utils/request';
import { Enhet } from 'lib/types/oppgaveTypes';
import { hentKøerForEnheterClient, hentOppgaverClient, plukkNesteOppgaveClient } from 'lib/oppgaveClientApi';
import { hentLagretAktivKøId, lagreAktivKøId } from 'lib/utils/aktivkøid';
import { useRouter } from 'next/navigation';
import { hentLagretAktivEnhet, lagreAktivEnhet } from 'lib/utils/aktivEnhet';
import { isError, isSuccess } from 'lib/utils/api';

interface Props {
  enheter: Enhet[];
}

export const OppgaveKøMedOppgaver = ({ enheter }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const [aktivKøId, setAktivKøId] = useState<number>();

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

  const { data: oppgaverValgtKø } = useSWR(
    aktivKøId ? `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/${veilederFilter}` : null,
    () => hentOppgaverClient(aktivKøId!, [aktivEnhet], veilederFilter === 'veileder')
  );

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

  return (
    <VStack gap={'5'}>
      <VStack gap={'4'}>
        <HStack justify={'space-between'}>
          <VStack justify={'center'}></VStack>
        </HStack>
        <Box background="surface-subtle" padding="4" borderRadius="xlarge">
          <VStack gap={'5'}>
            <HStack justify={'space-between'}>
              <HStack gap={'4'}>
                <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} valgtEnhetListener={oppdaterEnhet} />
                <KøSelect
                  label={'Velg kø'}
                  køer={isSuccess(køer) ? køer.data : []}
                  aktivKøId={aktivKøId}
                  valgtKøListener={oppdaterKøId}
                />
                <VStack justify={'end'}>
                  <Switch
                    value="veileder"
                    checked={veilederFilter === 'veileder'}
                    onChange={(e) => setVeilederFilter((x) => (x ? '' : e.target.value))}
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
                {isSuccess(køer) && <BodyShort>{køer.data.find((e) => e.id === aktivKøId)?.beskrivelse}</BodyShort>}
              </VStack>
              <VStack>
                <Label as="p" size={'small'}>
                  Totalt antall oppgaver
                </Label>
                {isSuccess(oppgaverValgtKø) && <BodyShort>{oppgaverValgtKø.data.antallTotalt}</BodyShort>}
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
      {isError(oppgaverValgtKø) && (
        <Alert
          variant={'error'}
          title={'Feil'}
        >{`Status ${oppgaverValgtKø.status}, msg: ${oppgaverValgtKø.apiException.message}`}</Alert>
      )}
      {isSuccess(oppgaverValgtKø) && !oppgaverValgtKø?.data.oppgaver.length && (
        <BodyShort>Ingen oppgaver i valgt kø for valgt enhet</BodyShort>
      )}
      {!isSuccess(oppgaverValgtKø) && !isError(oppgaverValgtKø) && (
        <VStack gap={'1'}>
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
        </VStack>
      )}
      {isSuccess(oppgaverValgtKø) && oppgaverValgtKø.data.oppgaver.length > 0 && (
        <OppgaveTabell oppgaver={oppgaverValgtKø.data?.oppgaver || []} showSortAndFiltersInTable />
      )}
    </VStack>
  );
};
