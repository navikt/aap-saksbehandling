'use client';

import { useEffect, useState, useTransition } from 'react';
import useSWR from 'swr';
import { BodyShort, Box, Button, HStack, Label, Switch, VStack } from '@navikt/ds-react';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { byggKelvinURL, queryParamsArray } from 'lib/utils/request';
import { Enhet } from 'lib/types/oppgaveTypes';
import { hentKøerForEnheterClient, plukkNesteOppgaveClient } from 'lib/oppgaveClientApi';
import { useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';
import { useRouter } from 'next/navigation';
import { useLagreAktivEnhet } from 'hooks/oppgave/aktivEnhetHook';
import { isError, isSuccess } from 'lib/utils/api';
import { useLedigeOppgaver } from 'hooks/oppgave/OppgaveHook';
import { LedigeOppgaverTabell } from 'components/oppgaveliste/ledigeoppgaver/ledigeoppgavertabell/LedigeOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { alleÅrsakerTilBehandlingOptions } from 'lib/utils/årsakerTilBehandling';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';
import { formaterDatoForBackend } from 'lib/utils/date';

import styles from './LedigeOppgaver2.module.css';
import { NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper } from '@navikt/aap-oppgave-typescript-types';
import { LedigeOppgaverFiltrering } from 'components/oppgaveliste/filtrering/ledigeoppgaverfiltrering/LedigeOppgaverFiltrering';
import { TabellSkeleton } from 'components/oppgaveliste/tabellskeleton/TabellSkeleton';

interface Props {
  enheter: Enhet[];
}

const ALLE_OPPGAVER_ID = 27; // Denne er definert i aap-oppgave

export const LedigeOppgaver2 = ({ enheter }: Props) => {
  const { hentLagretAktivKø, lagreAktivKøId } = useLagreAktivKø();
  const { lagreAktivEnhet, hentLagretAktivEnhet } = useLagreAktivEnhet();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const [aktivKøId, setAktivKøId] = useState<number>();

  const { form, formFields } = useConfigForm<FormFieldsFilter>({
    behandlingstyper: {
      type: 'checkbox',
      label: 'Behandlingstype',
      options: oppgaveBehandlingstyper,
      defaultValue: [],
    },
    behandlingOpprettetFom: {
      type: 'date',
      label: 'Opprettet fra',
    },
    behandlingOpprettetTom: {
      type: 'date',
      label: 'Opprettet til',
    },
    årsaker: {
      type: 'combobox_multiple',
      label: 'Årsak',
      options: alleÅrsakerTilBehandlingOptions,
      defaultValue: [],
    },
    avklaringsbehov: {
      type: 'combobox_multiple',
      label: 'Oppgave',
      options: oppgaveAvklaringsbehov,
      defaultValue: [],
    },
    statuser: {
      type: 'checkbox',
      label: 'Status',
      options: OppgaveStatuser,
      defaultValue: [],
    },
  });

  const behandlingOpprettetTom = form.watch('behandlingOpprettetTom');
  const behandlingOpprettetFom = form.watch('behandlingOpprettetFom');

  const { antallOppgaver, oppgaver, size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver, mutate } =
    useLedigeOppgaver([aktivEnhet], veilederFilter === 'veileder', aktivKøId, {
      behandlingstyper: (form.watch('behandlingstyper') ||
        []) as NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper[],
      tom: behandlingOpprettetTom ? formaterDatoForBackend(behandlingOpprettetTom) : undefined,
      fom: behandlingOpprettetFom ? formaterDatoForBackend(behandlingOpprettetFom) : undefined,
      statuser: form.watch('statuser') || [],
      årsaker: form.watch('årsaker') || [],
      avklaringsbehovKoder: form.watch('avklaringsbehov') || [],
    });

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
    const køId = hentLagretAktivKø();
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
        if (isSuccess(nesteOppgaveRes) && nesteOppgaveRes.data) {
          router.push(byggKelvinURL(nesteOppgaveRes.data.avklaringsbehovReferanse));
        }
      }
    });
  }

  const oppgaveKøer = isSuccess(køer) ? køer.data : undefined;

  return (
    <VStack gap={'5'}>
      <Box borderColor="border-divider" borderWidth="1" borderRadius={'xlarge'}>
        <VStack>
          <HStack
            justify={'space-between'}
            align={'end'}
            paddingInline={'4'}
            paddingBlock={'2'}
            style={{ borderBottom: '1px solid #071A3636' }}
          >
            <HStack gap={'4'} align={'end'}>
              <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} setAktivEnhet={oppdaterEnhet} />
              <KøSelect label={'Velg kø'} køer={oppgaveKøer || []} aktivKøId={aktivKøId} setAktivKø={oppdaterKøId} />
              <Switch
                value="veileder"
                checked={veilederFilter === 'veileder'}
                onChange={(e) => setVeilederFilter((prevState) => (prevState ? '' : e.target.value))}
                size={'small'}
              >
                Vis kun oppgaver jeg er veileder på
              </Switch>
            </HStack>

            <Button size="medium" onClick={() => plukkOgGåTilOppgave()} loading={isPending}>
              Behandle neste oppgave
            </Button>
          </HStack>
          <HStack gap={'2'} paddingInline={'4'} paddingBlock={'2'}>
            <Label as="p" size={'small'}>
              Beskrivelse av køen:
            </Label>
            <BodyShort size={'small'}>{oppgaveKøer?.find((e) => e.id === aktivKøId)?.beskrivelse}</BodyShort>
          </HStack>
        </VStack>
      </Box>

      <div className={styles.tabell}>
        <LedigeOppgaverFiltrering
          form={form}
          formFields={formFields}
          antallOppgaver={antallOppgaver}
          kanFiltrere={aktivKøId === 27}
          onFiltrerClick={() => setAktivKøId(ALLE_OPPGAVER_ID)}
        />
        {isLoading && <TabellSkeleton />}

        {!isLoading &&
          (oppgaver.length > 0 ? (
            <LedigeOppgaverTabell oppgaver={oppgaver} revalidateFunction={mutate} />
          ) : (
            <BodyShort size={'small'} className={styles.ingenoppgaver}>
              Ingen oppgaver i valgt kø for valgt enhet
            </BodyShort>
          ))}
      </div>

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
