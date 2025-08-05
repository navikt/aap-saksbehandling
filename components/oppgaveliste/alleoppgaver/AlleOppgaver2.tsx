'use client';

import { Enhet } from 'lib/types/oppgaveTypes';
import { EnhetSelect } from 'components/oppgaveliste/enhetselect/EnhetSelect';
import { useEffect, useState } from 'react';
import { useLagreAktivEnhet } from 'hooks/oppgave/aktivEnhetHook';
import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { AlleOppgaverTabell } from 'components/oppgaveliste/alleoppgaver/alleoppgavertabell/AlleOppgaverTabell';
import { useAlleOppgaverForEnhet } from 'hooks/oppgave/OppgaveHook';
import { KøSelect } from 'components/oppgaveliste/køselect/KøSelect';
import { isError, isSuccess } from 'lib/utils/api';
import useSWR from 'swr';
import { queryParamsArray } from 'lib/utils/request';
import { hentKøerForEnheterClient } from 'lib/oppgaveClientApi';
import { useLagreAktivKø } from 'hooks/oppgave/aktivkøHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { alleVurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import {
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper,
  NoNavAapOppgaveListeUtvidetOppgavelisteFilterReturStatuser,
} from '@navikt/aap-oppgave-typescript-types';
import { formaterDatoForBackend } from 'lib/utils/date';
import styles from 'components/oppgaveliste/ledigeoppgaver/LedigeOppgaver2.module.css';
import { TabellSkeleton } from 'components/oppgaveliste/tabellskeleton/TabellSkeleton';
import { AlleOppgaverFiltrering } from 'components/oppgaveliste/filtrering/alleoppgaverfiltrering/AlleOppgaverFiltrering';

interface Props {
  enheter: Enhet[];
}

const ALLE_OPPGAVER_ID = 27; // Denne er definert i aap-oppgave

export const AlleOppgaver2 = ({ enheter }: Props) => {
  const { hentLagretAktivEnhet, lagreAktivEnhet } = useLagreAktivEnhet();
  const { hentLagretAktivKø, lagreAktivKøId } = useLagreAktivKø();

  const [aktivEnhet, setAktivEnhet] = useState<string>(hentLagretAktivEnhet() ?? enheter[0]?.enhetNr ?? '');
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
      options: alleVurderingsbehovOptions,
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

  const utvidetFilter =
    aktivKøId === ALLE_OPPGAVER_ID
      ? {
          behandlingstyper: (form.watch('behandlingstyper') ||
            []) as NoNavAapOppgaveListeUtvidetOppgavelisteFilterBehandlingstyper[],
          tom: behandlingOpprettetTom ? formaterDatoForBackend(behandlingOpprettetTom) : undefined,
          fom: behandlingOpprettetFom ? formaterDatoForBackend(behandlingOpprettetFom) : undefined,
          returStatuser: (
            (form.watch('statuser') || []) as NoNavAapOppgaveListeUtvidetOppgavelisteFilterReturStatuser[]
          ).filter((status) => status.valueOf() !== 'VENT'),
          påVent: form.watch('statuser')?.includes('VENT'),
          årsaker: form.watch('årsaker') || [],
          avklaringsbehovKoder: form.watch('avklaringsbehov') || [],
        }
      : undefined;

  const { antallOppgaver, oppgaver, size, setSize, isLoading, isValidating, kanLasteInnFlereOppgaver, mutate } =
    useAlleOppgaverForEnhet([aktivEnhet], aktivKøId, utvidetFilter);

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

  const oppgaveKøer = isSuccess(køer) ? køer.data : undefined;

  return (
    <VStack gap={'4'}>
      <Box borderColor="border-divider" borderWidth="1" borderRadius={'xlarge'}>
        <VStack>
          <HStack paddingInline={'4'} paddingBlock={'2'} gap={'4'} style={{ borderBottom: '1px solid #071A3636' }}>
            <EnhetSelect enheter={enheter} aktivEnhet={aktivEnhet} setAktivEnhet={oppdaterEnhet} />
            <KøSelect label={'Velg kø'} køer={oppgaveKøer || []} aktivKøId={aktivKøId} setAktivKø={oppdaterKøId} />
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
          kanFiltrere={aktivKøId === 27}
          onFiltrerClick={() => setAktivKøId(ALLE_OPPGAVER_ID)}
        />
        {isLoading && <TabellSkeleton />}

        {!isLoading &&
          (oppgaver.length > 0 ? (
            <AlleOppgaverTabell oppgaver={oppgaver} revalidateFunction={mutate} />
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
