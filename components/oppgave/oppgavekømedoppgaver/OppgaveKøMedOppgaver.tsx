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
import { useRouter } from 'next/navigation';

interface Props {
  enheter: Enhet[];
}

export const OppgaveKøMedOppgaver = ({ enheter }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [aktivEnhet, setAktivEnhet] = useState<string>(enheter[0]?.enhetNr ?? '');
  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const [aktivKøId, setAktivKøId] = useState<number>();

  const køer = useSWR(`api/filter?${queryParamsArray('enheter', [aktivEnhet])}`, () =>
    hentKøerForEnheterClient([aktivEnhet])
  );

  useEffect(() => {
    if (køer.data?.type === 'success' && aktivKøId == null) {
      setAktivKøId(køer.data.data[0]?.id ?? 0);
    } else if (køer.data?.type === 'success') {
      const aktivkø = køer.data.data.find((e) => e.id === aktivKøId);
      if (!aktivkø) {
        setAktivKøId(køer.data.data[0]?.id ?? 0);
      }
    }
  }, [køer]);

  const oppgaverValgtKø = useSWR(
    aktivKøId ? `api/oppgave/oppgaveliste/${aktivKøId}/${aktivEnhet}/${veilederFilter}` : null,
    () => hentOppgaverClient(aktivKøId!, [aktivEnhet], veilederFilter === 'veileder')
  );

  async function plukkOgGåTilOppgave() {
    startTransition(async () => {
      if (aktivEnhet && aktivKøId) {
        const nesteOppgave = await plukkNesteOppgaveClient(aktivKøId, aktivEnhet);
        if (nesteOppgave.type === 'success') {
          if (nesteOppgave.data) {
            router.push(byggKelvinURL(nesteOppgave.data.avklaringsbehovReferanse));
          }
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
                <EnhetSelect
                  enheter={enheter}
                  valgtEnhetListener={(enhet) => {
                    setAktivEnhet(enhet);
                  }}
                />
                <KøSelect
                  label={'Velg kø'}
                  køer={køer.data?.type === 'success' ? køer.data.data : []}
                  valgtKøListener={(kø) => {
                    setAktivKøId(kø);
                  }}
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
              <VStack>
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
                {køer.data?.type === 'success' && (
                  <BodyShort spacing>{køer.data.data.find((e) => e.id === aktivKøId)?.beskrivelse}</BodyShort>
                )}
              </VStack>
              <VStack>
                <Label as="p" size={'small'}>
                  Totalt antall oppgaver
                </Label>
                {oppgaverValgtKø?.data?.type === 'success' && (
                  <BodyShort spacing>{oppgaverValgtKø?.data?.data.antallTotalt}</BodyShort>
                )}
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
      {oppgaverValgtKø?.data?.type === 'error' && (
        <Alert
          variant={'error'}
          title={'Feil'}
        >{`Status ${oppgaverValgtKø?.data?.status}, msg: ${oppgaverValgtKø?.data?.message}`}</Alert>
      )}
      {oppgaverValgtKø?.data?.type === 'success' && !oppgaverValgtKø?.data?.data?.oppgaver?.length && (
        <BodyShort>Ingen oppgaver i valgt kø for valgt enhet</BodyShort>
      )}
      {oppgaverValgtKø?.data?.type !== 'success' && oppgaverValgtKø?.data?.type !== 'error' && (
        <VStack gap={'1'}>
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
          <Skeleton variant="rectangle" width="100%" height={40} />
        </VStack>
      )}
      {oppgaverValgtKø?.data?.type === 'success' && oppgaverValgtKø?.data?.data?.oppgaver?.length > 0 && (
        <OppgaveTabell oppgaver={oppgaverValgtKø?.data?.data?.oppgaver || []} />
      )}
    </VStack>
  );
};
