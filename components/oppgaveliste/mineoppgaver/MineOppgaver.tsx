'use client';

import useSWR from 'swr';
import { hentMineOppgaverClient } from 'lib/oppgaveClientApi';
import { Alert, BodyShort, Box, HStack, Skeleton, VStack } from '@navikt/ds-react';
import { isError } from 'lib/utils/api';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { FormField } from 'components/form/FormField';
import { useCallback } from 'react';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';

interface FormFields {
  behandlingstype: string[];
  avklaringsbehov: string[];
  status: string[];
}

const oppgaveStatus = { VENT: (oppgave: Oppgave) => !!oppgave.påVentTil } as const;

export const MineOppgaver = () => {
  const { data: mineOppgaver, mutate, isLoading } = useSWR(`api/mine-oppgaver`, () => hentMineOppgaverClient());

  const { form, formFields } = useConfigForm<FormFields>({
    behandlingstype: {
      type: 'combobox_multiple',
      label: 'Behandlingstype',
      options: oppgaveBehandlingstyper,
    },
    avklaringsbehov: {
      type: 'combobox_multiple',
      label: 'Behandlingstype',
      options: oppgaveAvklaringsbehov,
    },
    status: {
      type: 'combobox_multiple',
      label: 'Behandlingstype',
      options: OppgaveStatuser,
    },
  });

  const behandlingstyper = form.watch('behandlingstype');
  const avklaringsbehov = form.watch('avklaringsbehov');
  const status = form.watch('status');

  const behandlingstypeFilter = useCallback(
    (oppgave: Oppgave) => {
      return behandlingstyper && behandlingstyper.length > 0
        ? behandlingstyper.find((option) => option === oppgave.behandlingstype)
        : true;
    },
    [behandlingstyper]
  );

  const avklaringsbehovFilter = useCallback(
    (oppgave: Oppgave) =>
      avklaringsbehov && avklaringsbehov.length > 0
        ? avklaringsbehov.find((option) => option === oppgave.avklaringsbehovKode)
        : true,
    [avklaringsbehov]
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
    (oppgave) => behandlingstypeFilter(oppgave) && avklaringsbehovFilter(oppgave) && statusFilter(oppgave)
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
      <Box background="surface-subtle" padding="4" borderRadius="xlarge">
        <HStack gap={'4'}>
          <FormField form={form} formField={formFields.behandlingstype} />
          <FormField form={form} formField={formFields.avklaringsbehov} />
          <FormField form={form} formField={formFields.status} />
        </HStack>
      </Box>
      <Filtrering />
      {filtrerteOppgaver && filtrerteOppgaver.length > 0 ? (
        <MineOppgaverTabell oppgaver={filtrerteOppgaver} revalidateFunction={mutate} />
      ) : (
        <BodyShort>Ingen reserverte oppgaver.</BodyShort>
      )}
    </>
  );
};
