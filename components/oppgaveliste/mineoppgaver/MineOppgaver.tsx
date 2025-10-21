'use client';

import { Alert, BodyShort } from '@navikt/ds-react';
import { MineOppgaverTabell } from 'components/oppgaveliste/mineoppgaver/mineoppgavertabell/MineOppgaverTabell';
import { useConfigForm } from 'components/form/FormHook';
import { oppgaveBehandlingstyper, OppgaveStatuser } from 'lib/utils/behandlingstyper';
import { MineOppgaverFiltrering } from 'components/oppgaveliste/filtrering/mineoppgaverfiltrering/MineOppgaverFiltrering';
import { useWatch } from 'react-hook-form';

import styles from 'components/oppgaveliste/mineoppgaver/MineOppgaver.module.css';
import { oppgaveAvklaringsbehov } from 'lib/utils/avklaringsbehov';
import { useFiltrerteOppgaver } from './MineOppgaverHook';
import { useMineOppgaver } from 'hooks/oppgave/OppgaveHook';
import { alleVurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { TabellSkeleton } from 'components/oppgaveliste/tabellskeleton/TabellSkeleton';
import { useLagreAktivUtvidetFilter } from 'hooks/oppgave/aktivUtvidetFilterHook';
import { useEffect } from 'react';

export interface FormFieldsFilter {
  behandlingstyper?: string[];
  behandlingOpprettetFom?: Date;
  behandlingOpprettetTom?: Date;
  årsaker?: string[];
  avklaringsbehov?: string[];
  statuser?: string[];
}

export const MineOppgaver = () => {
  const { oppgaver, mutate, isLoading, error } = useMineOppgaver();
  const { hentAktivUtvidetFilter, lagreAktivUtvidetFilter } = useLagreAktivUtvidetFilter();
  const lagretUtvidetFilter = hentAktivUtvidetFilter();

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

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const fieldValues = form.watch((values) => {
      lagreAktivUtvidetFilter(values as FormFieldsFilter);
    });
    return () => fieldValues.unsubscribe();
  }, [form, lagreAktivUtvidetFilter]);

  const filtrerteOppgaver = useFiltrerteOppgaver({
    oppgaver,
    filter: watchedValues,
  });

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className={styles.tabell}>
      <MineOppgaverFiltrering
        form={form}
        formFields={formFields}
        antallOppgaverTotalt={oppgaver?.length}
        antallOppgaverIFilter={filtrerteOppgaver?.length}
      />

      {isLoading && <TabellSkeleton />}

      {!isLoading &&
        (filtrerteOppgaver?.length > 0 ? (
          <MineOppgaverTabell oppgaver={filtrerteOppgaver} revalidateFunction={mutate} />
        ) : (
          <BodyShort className={styles.ingenreserverteoppgaver}>Ingen reserverte oppgaver.</BodyShort>
        ))}
    </div>
  );
};
