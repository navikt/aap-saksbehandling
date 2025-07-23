'use client';

import { BodyShort, Skeleton, VStack } from '@navikt/ds-react';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { Filtrering } from 'components/oppgaveliste/filtrering/Filtrering';
import { useWatch } from 'react-hook-form';

import styles from './MineOppgaver2.module.css';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { useFiltrerteOppgaver } from './MineOppgaverHook';
import { useMineOppgaver } from 'hooks/oppgave/OppgaveHook';

export interface FormFieldsFilter {
  behandlingstyper?: string[];
  behandlingOpprettetFom?: Date;
  behandlingOpprettetTom?: Date;
  årsaker?: string[];
  avklaringsbehov?: string[];
  statuser?: string[];
}

export const MineOppgaver2 = () => {
  const { oppgaver, mutate, isLoading } = useMineOppgaver();

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
      options: ['hello pello'],
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

  const watchedValues = useWatch({ control: form.control });

  const filtrerteOppgaver = useFiltrerteOppgaver({
    oppgaver,
    filters: watchedValues,
  });

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
        <Filtrering
          form={form}
          formFields={formFields}
          antallOppgaverTotalt={oppgaver?.length}
          antallOppgaverIFilter={filtrerteOppgaver?.length}
        />

        {filtrerteOppgaver && filtrerteOppgaver.length > 0 ? (
          <MineOppgaverTabell oppgaver={filtrerteOppgaver} revalidateFunction={mutate} />
        ) : (
          <BodyShort className={styles.ingenreserverteoppgaver}>Ingen reserverte oppgaver.</BodyShort>
        )}
      </div>
    </>
  );
};
