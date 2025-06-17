'use client';

import useSWR from 'swr';
import { hentMineOppgaverClient } from 'lib/oppgaveClientApi';
import { Alert, BodyShort, Skeleton, VStack } from '@navikt/ds-react';
import { isError } from 'lib/utils/api';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { useCallback } from 'react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';
import { NoNavAapOppgaveOppgaveDtoReturStatus } from '@navikt/aap-oppgave-typescript-types';
import { mapBehovskodeTilBehovstype, mapTilOppgaveBehandlingstypeTekst } from 'lib/utils/oversettelser';
import { formaterÅrsak } from 'lib/utils/årsaker';
import { ÅrsakTilBehandling } from 'lib/types/types';
import { erDatoFoerDato } from 'lib/validation/dateValidation';
import { formaterDatoForFrontend } from 'lib/utils/date';

import styles from './MineOppgaver2.module.css';

export interface FormFieldsFilter {
  behandlingstype: string[];
  behandlingOpprettetFom: Date;
  behandlingOpprettettom: Date;
  årsak: string[];
  oppgave: string[];
  status: string[];
}

const oppgaveStatus = {
  VENT: (oppgave: Oppgave) => !!oppgave.påVentTil,
  RETUR_KVALITETSSIKRER: (oppgave: Oppgave) =>
    oppgave.returStatus === NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_KVALITETSSIKRER,
  RETUR_BESLUTTER: (oppgave: Oppgave) =>
    oppgave.returStatus === NoNavAapOppgaveOppgaveDtoReturStatus.RETUR_FRA_BESLUTTER,
} as const;

export const MineOppgaver2 = () => {
  const { data: mineOppgaver, mutate, isLoading } = useSWR('api/mine-oppgaver', () => hentMineOppgaverClient());

  console.log(mineOppgaver);
  const oppgaver = (mineOppgaver?.type === 'SUCCESS' && mineOppgaver.data.oppgaver.flat()) || [];

  const behandlingstypeOption = [...new Set(oppgaver.map((oppgave) => oppgave.behandlingstype))];
  const årsakOption = [...new Set(oppgaver.flatMap((oppgave) => oppgave.årsakerTilBehandling))];
  const oppgaveOption = [...new Set(oppgaver.map((oppgave) => oppgave.avklaringsbehovKode))];

  const { form, formFields } = useConfigForm<FormFieldsFilter>({
    behandlingstype: {
      type: 'checkbox',
      label: 'Behandlingstype',
      options: behandlingstypeOption.map((option) => {
        return { label: mapTilOppgaveBehandlingstypeTekst(option), value: option };
      }),
    },
    behandlingOpprettetFom: {
      type: 'date',
      label: 'Opprettet fra',
    },
    behandlingOpprettettom: {
      type: 'date',
      label: 'Opprettet til',
    },
    årsak: {
      type: 'combobox_multiple',
      label: 'Årsak',
      options: årsakOption.map((option) => {
        return { label: formaterÅrsak(option as ÅrsakTilBehandling), value: option };
      }),
    },
    oppgave: {
      type: 'combobox_multiple',
      label: 'Oppgave',
      options: oppgaveOption.map((option) => {
        return { label: mapBehovskodeTilBehovstype(option), value: option };
      }),
    },
    status: {
      type: 'checkbox',
      label: 'Status',
      options: OppgaveStatuser,
    },
  });

  const behandlingstyper = form.watch('behandlingstype');
  const behandlingOpprettetFra = form.watch('behandlingOpprettetFom');
  const behandlingOpprettetTil = form.watch('behandlingOpprettettom');
  const årsaker = form.watch('årsak');
  const oppgaveOptions = form.watch('oppgave');
  const status = form.watch('status');

  const behandlingOpprettTilFilter = useCallback(
    (oppgave: Oppgave) => {
      return behandlingOpprettetTil
        ? erDatoFoerDato(
            formaterDatoForFrontend(oppgave.behandlingOpprettet),
            formaterDatoForFrontend(behandlingOpprettetTil.toDateString())
          )
        : true;
    },
    [behandlingOpprettetTil]
  );

  const behandlingOpprettetFraFilter = useCallback(
    (oppgave: Oppgave) => {
      return behandlingOpprettetFra
        ? erDatoFoerDato(
            formaterDatoForFrontend(behandlingOpprettetFra.toDateString()),
            formaterDatoForFrontend(oppgave.behandlingOpprettet)
          )
        : true;
    },
    [behandlingOpprettetFra]
  );

  const oppgaveFilter = useCallback(
    (oppgave: Oppgave) => {
      return oppgaveOptions && oppgaveOptions.length > 0
        ? oppgaveOptions.find(
            (avklaringsBehovKodeForOppgave) => oppgave.avklaringsbehovKode === avklaringsBehovKodeForOppgave
          )
        : true;
    },
    [oppgaveOptions]
  );

  const årsakerFilter = useCallback(
    (oppgave: Oppgave) => {
      return årsaker && årsaker.length > 0
        ? årsaker.find((option) => oppgave.årsakerTilBehandling.includes(option))
        : true;
    },
    [årsaker]
  );

  const behandlingstypeFilter = useCallback(
    (oppgave: Oppgave) => {
      return behandlingstyper && behandlingstyper.length > 0
        ? behandlingstyper.find((option) => option === oppgave.behandlingstype)
        : true;
    },
    [behandlingstyper]
  );

  const statusFilter = useCallback(
    (oppgave: Oppgave) =>
      status && status.length > 0
        ? status.find((option) => oppgaveStatus[option as keyof typeof oppgaveStatus](oppgave))
        : true,
    [status]
  );

  if (isError(mineOppgaver)) {
    return (
      <Alert
        variant={'error'}
        title={'Feil'}
      >{`Status ${mineOppgaver.status}, msg: ${mineOppgaver.apiException.message}`}</Alert>
    );
  }

  const filtrerteOppgaver = mineOppgaver?.data.oppgaver.filter(
    (oppgave) =>
      behandlingstypeFilter(oppgave) &&
      statusFilter(oppgave) &&
      årsakerFilter(oppgave) &&
      oppgaveFilter(oppgave) &&
      behandlingOpprettetFraFilter(oppgave) &&
      behandlingOpprettTilFilter(oppgave)
  );

  return (
    <>
      {isLoading && (
        <VStack gap={'7'}>
          <VStack gap={'1'}>
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
          </VStack>
          <VStack gap={'1'}>
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
            <Skeleton variant="rectangle" width="100%" height={40} />
          </VStack>
        </VStack>
      )}
      <div className={styles.tabell}>
        {mineOppgaver?.data.oppgaver && mineOppgaver?.data.oppgaver.flat().length > 0 && (
          <Filtrering
            form={form}
            formFields={formFields}
            antallOppgaverTotalt={mineOppgaver?.data.oppgaver.flat().length}
            antallOppgaverIFilter={filtrerteOppgaver?.length}
          />
        )}
        {filtrerteOppgaver && filtrerteOppgaver.length > 0 ? (
          <VStack gap={'4'}>
            <MineOppgaverTabell oppgaver={filtrerteOppgaver} revalidateFunction={mutate} />
          </VStack>
        ) : (
          <BodyShort>Ingen reserverte oppgaver.</BodyShort>
        )}
      </div>
    </>
  );
};
