'use client';

import { useMemo, useState } from 'react';
// import { Enhet, Kø } from 'lib/types/types';
import { OppgaveTabell } from 'components/oppgave/oppgavetabell/OppgaveTabell';
import useSWR from 'swr';
import { Alert, BodyShort, Button, Heading, HStack, Label, Loader, Skeleton, Switch, VStack } from '@navikt/ds-react';
// import { Kort } from 'components/kort/Kort';
// import { hentOppgaverClient, plukkNesteOppgaveClient } from 'lib/services/client';
import { EnhetSelect } from 'components/oppgave/enhetselect/EnhetSelect';
import { KøSelect } from 'components/oppgave/køselect/KøSelect';
import { byggKelvinURL } from 'lib/utils/request';
import { Enhet, Kø } from 'lib/types/oppgaveTypes';
import { hentOppgaverClient, plukkNesteOppgaveClient } from 'lib/oppgaveClientApi';
import {Kort} from "components/oppgave/kort/Kort";

interface Props {
  køer: Kø[];
  enheter: Enhet[];
}

export const OppgaveKøMedOppgaver = ({ køer, enheter }: Props) => {
  const [aktivKø, setAktivKø] = useState<number>(køer[0]?.id ?? 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aktivEnhet, setAktivEnhet] = useState<string>(enheter[0]?.enhetNr ?? '');
  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const aktivKøBeskrivelse = useMemo(() => køer.find((e) => e.id === aktivKø)?.beskrivelse, [aktivKø, køer]);

  const oppgaverValgtKø = useSWR(`api/oppgave/oppgaveliste/${aktivKø}/${aktivEnhet}/${veilederFilter}`, () =>
    hentOppgaverClient(aktivKø, [aktivEnhet], veilederFilter === 'veileder')
  );

  async function plukkOgGåTilOppgave() {
    setIsLoading(true);
    if (aktivEnhet) {
      const nesteOppgave = await plukkNesteOppgaveClient(aktivKø, aktivEnhet);
      if (nesteOppgave.type === 'success') {
        if (nesteOppgave.data) {
          console.log('plukket oppgave:', nesteOppgave);
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
          <Heading level="2" size="medium">
            Oppgavekø
          </Heading>
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
                køer={køer}
                valgtKøListener={(kø) => {
                  setAktivKø(kø);
                }}
              />
            </VStack>
            <VStack>
              <Label as="p" size={'small'} spacing>
                Beskrivelse av køen
              </Label>
              <BodyShort spacing>{aktivKøBeskrivelse}</BodyShort>
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
          <OppgaveTabell oppgaver={oppgaverValgtKø?.data?.data?.oppgaver || []} showBehandleKnapp />
        )}
      </VStack>
    </Kort>
  );
};
