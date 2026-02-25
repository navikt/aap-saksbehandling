'use client';

import { Enhet } from 'lib/types/oppgaveTypes';
import { useEffect, useState } from 'react';
import { Alert, BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { AlleOppgaverTabellNy } from 'components/oppgaveliste/alleoppgaverny/alleoppgavertabell/AlleOppgaverTabellNy';
import { useAlleOppgaverForEnhet } from 'hooks/oppgave/OppgaveHook';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { isError, isSuccess } from 'lib/utils/api';
import useSWR from 'swr';
import { queryParamsArray } from 'lib/utils/request';
import { hentKøerForEnheterClient } from 'lib/oppgaveClientApi';
import { useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { alleVurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import {
  NoNavAapOppgaveListeOppgaveSorteringSortBy,
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper,
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterReturStatuser,
} from '@navikt/aap-oppgave-typescript-types';
import { formaterDatoForBackend } from 'lib/utils/date';
import styles from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver.module.css';
import { TabellSkeleton } from 'components/oppgaveliste/tabellskeleton/TabellSkeleton';
import { AlleOppgaverFiltrering } from 'components/oppgaveliste/filtrering/alleoppgaverfiltrering/AlleOppgaverFiltrering';
import { ALLE_OPPGAVER_ID } from 'components/oppgaveliste/filtrering/filtreringUtils';
import { useLagreAktivUtvidetFilter } from 'hooks/oppgave/aktivUtvidetFilterHook';
import { ComboOption } from 'components/produksjonsstyring/minenhet/MineEnheter';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';
import { EnheterSelect } from 'components/oppgaveliste/enheterselect/EnheterSelect';
import { useBackendSortering } from 'hooks/oppgave/BackendSorteringHook';

interface Props {
  enheter: Enhet[];
}

export const AlleOppgaverNy = ({ enheter }: Props) => {
  const { hentLagretAktivKø, lagreAktivKøId } = useLagreAktivKø();
  const { hentAktivUtvidetFilter, lagreAktivUtvidetFilter } = useLagreAktivUtvidetFilter();
  const { hentLagredeAktiveEnheter, lagreAktiveEnheter } = useLagreAktiveEnheter();

  const [aktivKøId, setAktivKøId] = useState<number>(ALLE_OPPGAVER_ID);
  const [valgteRader, setValgteRader] = useState<number[]>([]);
  const lagretUtvidetFilter = hentAktivUtvidetFilter();

  const { sort, setSort } = useBackendSortering<NoNavAapOppgaveListeOppgaveSorteringSortBy>('alle-oppgaver');

  function førsteEnhetTilComboOption(enheter: Enhet[]): ComboOption[] | null {
    const førsteEnhet = enheter.find((e) => e);
    if (førsteEnhet) {
      return [{ value: førsteEnhet.enhetNr, label: førsteEnhet.navn }];
    }
    return null;
  }
  const [aktiveEnheter, setAktiveEnheter] = useState<ComboOption[]>(
    hentLagredeAktiveEnheter() ?? førsteEnhetTilComboOption(enheter) ?? []
  );
  const aktiveEnhetsnumre = aktiveEnheter.map((enhet) => enhet.value);
  const oppdaterEnheter = (enheter: ComboOption[]) => {
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
  });

  const behandlingOpprettetTom = form.watch('behandlingOpprettetTom');
  const behandlingOpprettetFom = form.watch('behandlingOpprettetFom');
  const andreStatusTyper = ['VENT', 'ER_HASTESAK', 'VENTEFRIST_UTLØPT'];

  const utvidetFilter =
    aktivKøId === ALLE_OPPGAVER_ID
      ? {
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
        }
      : undefined;

  const { antallOppgaver, oppgaver, size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver, mutate } =
    useAlleOppgaverForEnhet(aktiveEnhetsnumre, aktivKøId, utvidetFilter, sort);

  const { data: køer } = useSWR(`api/filter?${queryParamsArray('enheter', aktiveEnhetsnumre)}`, () =>
    hentKøerForEnheterClient(aktiveEnhetsnumre)
  );

  useEffect(() => {
    const fieldValues = form.watch((values) => {
      lagreAktivUtvidetFilter(values as FormFieldsFilter);
    });
    return () => fieldValues.unsubscribe();
  }, [form, lagreAktivUtvidetFilter]);

  const oppdaterKøId = (id: number) => {
    setAktivKøId(id);
    lagreAktivKøId(id);
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

  if (isError(køer)) {
    return <Alert variant="error">{køer.apiException.message}</Alert>;
  }

  const oppgaveKøer = isSuccess(køer) ? køer.data : undefined;

  return (
    <VStack gap={'4'}>
      <Box borderColor="border-divider" borderWidth="1" borderRadius={'xlarge'}>
        <VStack>
          <HStack paddingInline={'4'} paddingBlock={'2'} gap={'4'} style={{ borderBottom: '1px solid #071A3636' }}>
            <EnheterSelect
              enheter={enheter}
              aktiveEnheter={aktiveEnheter}
              setAktiveEnheter={oppdaterEnheter}
              className={styles.velgenhet}
            />
            <KøSelect
              label={'Velg kø'}
              køer={oppgaveKøer || []}
              aktivKøId={aktivKøId}
              setAktivKø={oppdaterKøId}
              form={form}
            />
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
        <AlleOppgaverFiltrering
          form={form}
          formFields={formFields}
          antallOppgaver={antallOppgaver}
          kanFiltrere={aktivKøId === ALLE_OPPGAVER_ID}
          onFiltrerClick={() => oppdaterKøId(ALLE_OPPGAVER_ID)}
          valgteRader={valgteRader}
          setValgteRader={setValgteRader}
          revalidateFunction={mutate}
        />
        {isLoading && <TabellSkeleton />}

        {!isLoading && oppgaver.length > 0 ? (
          <AlleOppgaverTabellNy
            oppgaver={oppgaver}
            revalidateFunction={mutate}
            valgteRader={valgteRader}
            setValgteRader={setValgteRader}
            setSortBy={setSort}
            sort={sort}
          />
        ) : (
          <BodyShort size={'small'} className={styles.ingenoppgaver}>
            Ingen oppgaver i valgt kø for valgt enhet
          </BodyShort>
        )}
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
