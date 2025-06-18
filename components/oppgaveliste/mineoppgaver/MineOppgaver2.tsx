'use client';

import useSWR from 'swr';
import { hentMineOppgaverClient } from 'lib/oppgaveClientApi';
import { Alert, BodyShort, Skeleton, VStack } from '@navikt/ds-react';
import { isError } from 'lib/utils/api';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { behandlingsTyperOptions, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { useCallback } from 'react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';
import { NoNavAapOppgaveOppgaveDtoReturStatus } from '@navikt/aap-oppgave-typescript-types';
import { erDatoFoerDato } from 'lib/validation/dateValidation';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { useWatch } from 'react-hook-form';

import styles from './MineOppgaver2.module.css';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';

export interface FormFieldsFilter {
  behandlingstyper: string[];
  behandlingOpprettetFom: Date;
  behandlingOpprettetTom: Date;
  årsaker: string[];
  avklaringsbehov: string[];
  statuser: string[];
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

  const { form, formFields } = useConfigForm<FormFieldsFilter>({
    behandlingstyper: {
      type: 'checkbox',
      label: 'Behandlingstype',
      options: behandlingsTyperOptions,
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
      options: ['hello pello'],
    },
    avklaringsbehov: {
      type: 'combobox_multiple',
      label: 'Oppgave',
      options: oppgaveAvklaringsbehov,
    },
    statuser: {
      type: 'checkbox',
      label: 'Status',
      options: OppgaveStatuser,
    },
  });

  const { behandlingstyper, avklaringsbehov, behandlingOpprettetFom, behandlingOpprettetTom, statuser, årsaker } =
    useWatch({
      control: form.control,
    });

  const behandlingOpprettetFilter = useCallback(
    (oppgave: Oppgave) => {
      const dato = formaterDatoForFrontend(oppgave.behandlingOpprettet);

      if (behandlingOpprettetFom && !erDatoFoerDato(formaterDatoForFrontend(behandlingOpprettetFom), dato)) {
        return false;
      }

      if (behandlingOpprettetTom && !erDatoFoerDato(dato, formaterDatoForFrontend(behandlingOpprettetTom))) {
        return false;
      }

      return true;
    },
    [behandlingOpprettetTom, behandlingOpprettetFom]
  );

  const avklaringsbehovFilter = useCallback(
    (oppgave: Oppgave) => {
      if (!avklaringsbehov || avklaringsbehov.length === 0) {
        return true;
      }

      return avklaringsbehov.includes(oppgave.avklaringsbehovKode);
    },
    [avklaringsbehov]
  );

  const årsakerFilter = useCallback(
    (oppgave: Oppgave) => {
      if (!årsaker || årsaker.length === 0) {
        return true;
      }

      return oppgave.årsakerTilBehandling.some((årsak) => årsaker.includes(årsak));
    },
    [årsaker]
  );

  const behandlingstypeFilter = useCallback(
    (oppgave: Oppgave) => {
      if (!behandlingstyper || behandlingstyper.length === 0) {
        return true;
      }

      return behandlingstyper.includes(oppgave.behandlingstype);
    },
    [behandlingstyper]
  );

  const statusFilter = useCallback(
    (oppgave: Oppgave) => {
      if (!statuser || statuser.length === 0) {
        return true;
      }
      return statuser.find((option) => oppgaveStatus[option as keyof typeof oppgaveStatus](oppgave));
    },
    [statuser]
  );

  if (isError(mineOppgaver)) {
    return (
      <Alert
        variant={'error'}
        title={'Feil'}
      >{`Status ${mineOppgaver.status}, msg: ${mineOppgaver.apiException.message}`}</Alert>
    );
  }

  const filtrerteOppgaver = mineOppgaver?.data.oppgaver
    .flat()
    .filter(
      (oppgave) =>
        behandlingstypeFilter(oppgave) &&
        statusFilter(oppgave) &&
        årsakerFilter(oppgave) &&
        avklaringsbehovFilter(oppgave) &&
        behandlingOpprettetFilter(oppgave)
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
          <MineOppgaverTabell oppgaver={filtrerteOppgaver} revalidateFunction={mutate} />
        ) : (
          <BodyShort className={styles.ingenreserverteoppgaver}>Ingen reserverte oppgaver.</BodyShort>
        )}
      </div>
    </>
  );
};
