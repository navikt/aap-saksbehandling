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

export interface FormFieldsFilter {
  behandlingstype: string[];
  behandlingOpprettetFom: string;
  behandlingOpprettettom: string;
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
  const { data: mineOppgaver, mutate, isLoading } = useSWR(`api/mine-oppgaver`, () => hentMineOppgaverClient());

  console.log('mineOppgaver', mineOppgaver?.type === 'SUCCESS' && mineOppgaver.data.oppgaver.flat());

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
        return { label: option, value: option };
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
  const status = form.watch('status');

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
    (oppgave) => behandlingstypeFilter(oppgave) && statusFilter(oppgave)
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
    </>
  );
};
