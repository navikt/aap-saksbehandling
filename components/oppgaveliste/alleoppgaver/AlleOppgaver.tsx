'use client';

import { Enhet } from 'lib/types/oppgaveTypes';
import { useEffect, useState } from 'react';
import { Alert, BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { AlleOppgaverTabell } from 'components/oppgaveliste/alleoppgaver/alleoppgavertabell/AlleOppgaverTabell';
import { useAlleOppgaverForEnhet } from 'hooks/oppgave/OppgaveHook';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { isError, isSuccess } from 'lib/utils/api';
import useSWR from 'swr';
import { queryParamsArray } from 'lib/utils/request';
import { hentKøerForEnheterClient } from 'lib/oppgaveClientApi';
import { AktivKø, useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';
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
import { useLagreAktivUtvidetFilter } from 'hooks/oppgave/aktivUtvidetFilterHook';
import { useLagreAktiveEnheter } from 'hooks/oppgave/aktiveEnheterHook';
import { EnheterSelect } from 'components/oppgaveliste/enheterselect/EnheterSelect';
import { useBackendSortering } from 'hooks/oppgave/BackendSorteringHook';
import { AlleOppgaverFiltrering } from 'components/oppgaveliste/filtrering/alleoppgaverfiltrering/AlleOppgaverFiltrering';
import { ValuePair } from 'components/form/FormField';
import { useInnloggetBruker } from 'hooks/BrukerHook';

interface Props {
  enheter: Enhet[];
}

export const AlleOppgaver = ({ enheter }: Props) => {
  const { hentLagretAktivKø, lagreAktivKø } = useLagreAktivKø();
  const { hentAktivUtvidetFilter, lagreAktivUtvidetFilter } = useLagreAktivUtvidetFilter();
  const { hentLagredeAktiveEnheter, lagreAktiveEnheter } = useLagreAktiveEnheter();

  const bruker = useInnloggetBruker();
  const [aktivKø, setAktivKø] = useState<AktivKø | undefined>(undefined);

  const [valgteRader, setValgteRader] = useState<number[]>([]);
  const lagretUtvidetFilter = hentAktivUtvidetFilter();

  const { sort, setSort } =
    useBackendSortering<NoNavAapOppgaveListeOppgaveSorteringSortBy>('alle-oppgaver-backendsort');

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

  const { form, formFields } = useConfigForm<FormFieldsFilter>(
    {
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
      tilbakekrevingBeløpFom: {
        type: 'text',
        label: 'Beløp fra',
        rules: { pattern: { value: /^\d*$/, message: 'Kun tall' } },
        defaultValue: lagretUtvidetFilter?.tilbakekrevingBeløpFom ?? undefined,
      },
      tilbakekrevingBeløpTom: {
        type: 'text',
        label: 'Beløp til',
        rules: { pattern: { value: /^\d*$/, message: 'Kun tall' } },
        defaultValue: lagretUtvidetFilter?.tilbakekrevingBeløpTom ?? undefined,
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
        defaultValue: lagretUtvidetFilter?.saksbehandlere ?? [],
      },
    },
    { mode: 'onChange' }
  );

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
    saksbehandlere: (form.watch('saksbehandlere') || []).map((option) => option.value),
    beløpMerEnn: form.watch('tilbakekrevingBeløpFom') ? Number(form.watch('tilbakekrevingBeløpFom')) : undefined,
    beløpMindreEnn: form.watch('tilbakekrevingBeløpTom') ? Number(form.watch('tilbakekrevingBeløpTom')) : undefined,
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
  } = useAlleOppgaverForEnhet(aktiveEnhetsnumre, aktivKø?.id ?? 0, utvidetFilter, sort);

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
    <VStack gap={"space-16"}>
      <Box borderColor="neutral-subtle" borderWidth="1" borderRadius={"12"}>
        <VStack>
          <HStack paddingInline={"space-16"} paddingBlock={"space-8"} gap={"space-16"} style={{ borderBottom: '1px solid #071A3636' }}>
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
          </HStack>
          <HStack gap={"space-8"} paddingInline={"space-16"} paddingBlock={"space-8"}>
            <Label as="p" size={'small'}>
              Beskrivelse av køen:
            </Label>
            <BodyShort size={'small'}>{oppgaveKøer?.find((e) => e.id === aktivKø.id)?.beskrivelse}</BodyShort>
          </HStack>
        </VStack>
      </Box>
      <div className={styles.tabell}>
        <AlleOppgaverFiltrering
          form={form}
          formFields={formFields}
          antallOppgaver={antallOppgaver}
          valgteRader={valgteRader}
          setValgteRader={setValgteRader}
          revalidateFunction={mutate}
          aktivKø={aktivKø}
          aktiveEnheter={aktiveEnhetsnumre}
          sattBehandlingstyperFilter={behandlingstyperFilterFraBackend}
        />
        {isLoading && <TabellSkeleton />}

        {!isLoading && oppgaver.length > 0 ? (
          <AlleOppgaverTabell
            oppgaver={oppgaver}
            revalidateFunction={mutate}
            valgteRader={valgteRader}
            setValgteRader={setValgteRader}
            setSortBy={setSort}
            sort={sort}
            aktivKø={aktivKø}
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
