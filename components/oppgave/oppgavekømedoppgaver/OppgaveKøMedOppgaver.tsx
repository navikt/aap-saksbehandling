'use client';

import { useEffect, useState } from 'react';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import useSWR from 'swr';
import { Alert, BodyShort, Button, HStack, Label, Loader, Skeleton, Switch, VStack } from '@navikt/ds-react';
import { EnhetSelect } from 'components/oppgave/enhetselect/EnhetSelect';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { byggKelvinURL, queryParamsArray } from 'lib/utils/request';
import { Enhet } from 'lib/types/oppgaveTypes';
import { hentKøerForEnheterClient, hentOppgaverClient, plukkNesteOppgaveClient } from 'lib/oppgaveClientApi';
import { Kort } from 'components/oppgave/kort/Kort';

interface Props {
  enheter: Enhet[];
}

export const OppgaveKøMedOppgaver = ({ enheter }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    if (aktivEnhet && aktivKøId) {
      const nesteOppgave = await plukkNesteOppgaveClient(aktivKøId, aktivEnhet);
      if (nesteOppgave.type === 'success') {
        if (nesteOppgave.data) {
          window.location.assign(byggKelvinURL(nesteOppgave.data.avklaringsbehovReferanse));
        }
      }
    }
    setIsLoading(false);
  }

  return (
    <Kort>
      <VStack gap={'5'}>
        <VStack gap={'4'}>
          <HStack gap={'6'}>
            <VStack>
              <EnhetSelect
                enheter={enheter}
                valgtEnhetListener={(enhet) => {
                  setAktivEnhet(enhet);
                }}
              />
            </VStack>
            <VStack>
              <KøSelect
                label={'Velg kø du skal jobbe på'}
                køer={køer.data?.type === 'success' ? køer.data.data : []}
                valgtKøListener={(kø) => {
                  setAktivKøId(kø);
                }}
              />
            </VStack>
            <VStack>
              <Label as="p" size={'small'} spacing>
                Beskrivelse av køen
              </Label>
              {køer.data?.type === 'success' && (
                <BodyShort spacing>{køer.data.data.find((e) => e.id === aktivKøId)?.beskrivelse}</BodyShort>
              )}
            </VStack>
            <VStack>
              <Label as="p" size={'small'} spacing>
                Totalt antall oppgaver i valgt kø
              </Label>
              {oppgaverValgtKø?.data?.type === 'success' && (
                <BodyShort spacing>{oppgaverValgtKø?.data?.data.antallTotalt}</BodyShort>
              )}
            </VStack>
            <VStack>
              <Switch
                value="veileder"
                checked={veilederFilter === 'veileder'}
                onChange={(e) => setVeilederFilter((x) => (x ? '' : e.target.value))}
              >
                Vis kun oppgaver jeg er veileder på
              </Switch>
            </VStack>
            {oppgaverValgtKø.isValidating && (
              <VStack justify={'center'}>
                <Loader size={'2xlarge'} />
              </VStack>
            )}
          </HStack>
          <HStack>
            <Button size="small" onClick={() => plukkOgGåTilOppgave()}>
              <HStack gap={'2'}>
                Behandle neste oppgave
                {isLoading && (
                  <VStack justify={'center'}>
                    <Loader />
                  </VStack>
                )}
              </HStack>
            </Button>
          </HStack>
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
    </Kort>
  );
};
