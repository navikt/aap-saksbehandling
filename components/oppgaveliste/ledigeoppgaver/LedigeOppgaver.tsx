'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Alert, BodyShort, Box, Button, HStack, Label, Switch, VStack } from '@navikt/ds-react';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { queryParamsArray } from 'lib/utils/request';
import { Enhet } from 'lib/types/oppgaveTypes';
import { hentKøerForEnheterClient } from 'lib/oppgaveClientApi';
import { AktivKø, useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';
import { isError, isSuccess } from 'lib/utils/api';
import { useLedigeOppgaver } from 'hooks/oppgave/OppgaveHook';
import { LedigeOppgaverTabell } from 'components/oppgaveliste/ledigeoppgaver/ledigeoppgavertabell/LedigeOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { alleVurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { formaterDatoForBackend } from 'lib/utils/date';

import styles from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver.module.css';
import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper,
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterReturStatuser,
} from '@navikt/aap-oppgave-typescript-types';
import { TabellSkeleton } from 'components/oppgaveliste/tabellskeleton/TabellSkeleton';
import { useLagreAktivUtvidetFilter } from 'hooks/oppgave/aktivUtvidetFilterHook';
import { EnheterSelect } from 'components/oppgaveliste/enheterselect/EnheterSelect';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';
import { useBackendSortering } from 'hooks/oppgave/BackendSorteringHook';
import { LedigeOppgaverFiltrering } from 'components/oppgaveliste/filtrering/ledigeoppgaverfiltrering/LedigeOppgaverFiltrering';
import { ValuePair } from 'components/form/FormField';
import { useInnloggetBruker } from 'hooks/BrukerHook';

interface Props {
  enheter: Enhet[];
}

export const LedigeOppgaver = ({ enheter }: Props) => {
  const { sort, setSort } =
    useBackendSortering<NoNavAapOppgaveListeOppgaveSorteringSortBy>('ledige-oppgaver-backendsort');
  const { hentLagretAktivKø, lagreAktivKø } = useLagreAktivKø();
  const { hentAktivUtvidetFilter, lagreAktivUtvidetFilter } = useLagreAktivUtvidetFilter();
  const { hentLagredeAktiveEnheter, lagreAktiveEnheter } = useLagreAktiveEnheter();

  const bruker = useInnloggetBruker();
  const [aktivKø, setAktivKø] = useState<AktivKø | undefined>(undefined);

  const [veilederFilter, setVeilederFilter] = useState<string>('');
  const lagretUtvidetFilter = hentAktivUtvidetFilter();

  function førsteEnhetTilComboOption(enheter: Enhet[]): ValuePair[] | null {
    const førsteEnhet = enheter.find((e) => e);
    if (førsteEnhet) {
      return [{ value: førsteEnhet.enhetNr, label: førsteEnhet.navn }];
    }
    return null;
  }

  const [aktiveEnheter, setAktiveEnheter] = useState<ValuePair[]>(
    hentLagredeAktiveEnheter() ?? førsteEnhetTilComboOption(enheter) ?? []
  );
  const aktiveEnhetsnumre = aktiveEnheter.map((enhet) => enhet.value);
  const oppdaterEnheter = (enheter: ValuePair[]) => {
    setAktiveEnheter(enheter);
    lagreAktiveEnheter(enheter);
  };

  const { form, formFields } = useConfigForm<FormFieldsFilter>({
    behandlingstyper: {
      type: 'checkbox',
      label: 'Behandlingstype',
      options: oppgaveBehandlingstyper,
      defaultValue: lagretUtvidetFilter?.behandlingstyper ?? [],
    },
    behandlingOpprettetFom: {
      type: 'date',
      label: 'Opprettet fra',
      toDate: new Date(),
      defaultValue: lagretUtvidetFilter?.behandlingOpprettetFom,
    },
    behandlingOpprettetTom: {
      type: 'date',
      label: 'Opprettet til',
      defaultValue: lagretUtvidetFilter?.behandlingOpprettetTom,
    },
    årsaker: {
      type: 'combobox_multiple',
      label: 'Vurderingsbehov',
      options: alleVurderingsbehovOptions,
      defaultValue: lagretUtvidetFilter?.årsaker ?? [],
    },
    avklaringsbehov: {
      type: 'combobox_multiple',
      label: 'Oppgave',
      options: oppgaveAvklaringsbehov,
      defaultValue: lagretUtvidetFilter?.avklaringsbehov ?? [],
    },
    statuser: {
      type: 'checkbox',
      label: 'Markering',
      options: OppgaveStatuser,
      defaultValue: lagretUtvidetFilter?.statuser ?? [],
    },
    saksbehandlere: {
      type: 'fieldArray',
    },
  });

  const behandlingOpprettetTom = form.watch('behandlingOpprettetTom');
  const behandlingOpprettetFom = form.watch('behandlingOpprettetFom');
  const andreStatusTyper = ['VENT', 'ER_HASTESAK', 'VENTEFRIST_UTLØPT'];

  const utvidetFilter = {
    behandlingstyper: (form.watch('behandlingstyper') ||
      []) as NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper[],
    tom: behandlingOpprettetTom ? formaterDatoForBackend(behandlingOpprettetTom) : undefined,
    fom: behandlingOpprettetFom ? formaterDatoForBackend(behandlingOpprettetFom) : undefined,
    returStatuser: (
      (form.watch('statuser') || []) as NoNavAapOppgaveListeUtvidetOppgavelisteFilterReturStatuser[]
    ).filter((status) => !andreStatusTyper.includes(status.valueOf())),
    påVent: form.watch('statuser')?.includes('VENT'),
    årsaker: form.watch('årsaker') || [],
    avklaringsbehovKoder: form.watch('avklaringsbehov') || [],
    markertHaster: form.watch('statuser')?.includes('ER_HASTESAK'),
    ventefristUtløpt: form.watch('statuser')?.includes('VENTEFRIST_UTLØPT'),
    saksbehandlere: [],
  };

  const {
    antallOppgaver,
    oppgaver,
    size,
    setSize,
    isLoading,
    isValidating,
    kanLasteInnFlereOppgaver,
    mutate,
    behandlingstyperFilterFraBackend,
  } = useLedigeOppgaver(aktiveEnhetsnumre, veilederFilter === 'veileder', aktivKø?.id ?? 0, utvidetFilter, sort);

  const { data: køer } = useSWR(`api/filter?${queryParamsArray('enheter', aktiveEnhetsnumre)}`, () =>
    hentKøerForEnheterClient(aktiveEnhetsnumre)
  );

  useEffect(() => {
    const fieldValues = form.watch((values) => {
      lagreAktivUtvidetFilter(values as FormFieldsFilter);
    });
    return () => fieldValues.unsubscribe();
  }, [form, lagreAktivUtvidetFilter]);

  const oppdaterKø = (kø: AktivKø) => {
    setAktivKø(kø);
    lagreAktivKø(kø.id, kø.type);
  };

  useEffect(() => {
    if (isError(køer) || !køer?.data?.length) {
      return;
    }
    const lagretKø = hentLagretAktivKø();
    const gyldigeKøer = køer.data.map((kø) => kø.id);

    if (lagretKø && gyldigeKøer.includes(lagretKø.id)) {
      oppdaterKø(lagretKø);
    } else {
      const førsteKø = køer.data[0];
      oppdaterKø({ id: førsteKø.id!, type: førsteKø.type, timestamp: new Date().getTime(), user: bruker.NAVident });
    }
  }, [køer]);

  if (isError(køer)) {
    return <Alert variant="error">{køer.apiException.message}</Alert>;
  }

  if (!aktivKø) {
    return <TabellSkeleton />;
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
              <EnheterSelect
                enheter={enheter}
                aktiveEnheter={aktiveEnheter}
                setAktiveEnheter={oppdaterEnheter}
                className={styles.velgenhet}
              />
              <KøSelect
                label={'Velg kø'}
                køer={oppgaveKøer || []}
                aktivKø={aktivKø}
                oppdaterKø={oppdaterKø}
                form={form}
              />
              <Switch
                value="veileder"
                checked={veilederFilter === 'veileder'}
                onChange={(e) => setVeilederFilter((prevState) => (prevState ? '' : e.target.value))}
                size={'small'}
              >
                Vis kun oppgaver jeg er veileder på
              </Switch>
            </HStack>
          </HStack>
          <HStack gap={'2'} paddingInline={'4'} paddingBlock={'2'}>
            <Label as="p" size={'small'}>
              Beskrivelse av køen:
            </Label>
            <BodyShort size={'small'}>{oppgaveKøer?.find((e) => e.id === aktivKø.id)?.beskrivelse}</BodyShort>
          </HStack>
        </VStack>
      </Box>

      <div className={styles.tabell}>
        <LedigeOppgaverFiltrering
          form={form}
          formFields={formFields}
          antallOppgaver={antallOppgaver}
          aktivKø={aktivKø}
          sattBehandlingstyperFilter={behandlingstyperFilterFraBackend}
        />
        {isLoading && <TabellSkeleton />}

        {!isLoading &&
          (oppgaver.length > 0 ? (
            <LedigeOppgaverTabell
              oppgaver={oppgaver}
              setSortBy={setSort}
              sort={sort}
              revalidateFunction={mutate}
              aktivKøId={aktivKø.id}
            />
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
