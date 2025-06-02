'use client';

import { BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';

import styles from './Filtrering.module.css';
import { useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface FormFields {
  behandlingstype: string[];
  behandlingOpprettetFom: string;
  behandlingOpprettettom: string;
  årsak: string[];
  oppgave: string[];
  status: string;
}

export const Filtrering = () => {
  const [visFilter, setVisFilter] = useState(false);

  const { form, formFields } = useConfigForm<FormFields>({
    behandlingstype: {
      type: 'checkbox',
      label: 'Behandlingstype',
      options: ['Option 1', 'Option 2', 'Option 3'],
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
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    oppgave: {
      type: 'combobox_multiple',
      label: 'Oppgave',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    status: {
      type: 'checkbox',
      label: 'Status',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
  });

  return (
    <div className={styles.wrapper}>
      <HStack justify={'space-between'} align={'end'} className={styles.filtreringTop}>
        <Button
          icon={visFilter ? <XMarkIcon /> : <FilterIcon />}
          iconPosition={'right'}
          variant={'secondary'}
          size={'small'}
          onClick={() => setVisFilter(!visFilter)}
        >
          {visFilter ? 'Lukk filter' : 'Filtrer listen'}
        </Button>
        <Detail>Viser 25 av totalt 50 oppgaver</Detail>
      </HStack>

      {visFilter && (
        <div className={styles.filtreringwrapper}>
          <div className={styles.filtrering}>
            <HStack gap={'4'}>
              <MyBeautifulFormFieldWrapper>
                <FormField form={form} formField={formFields.behandlingstype} />
              </MyBeautifulFormFieldWrapper>
              <MyBeautifulFormFieldWrapper>
                <VStack gap={'4'}>
                  <BodyShort size={'small'} weight={'semibold'}>
                    Behandling opprettet
                  </BodyShort>
                  <FormField form={form} formField={formFields.behandlingOpprettetFom} />
                  <FormField form={form} formField={formFields.behandlingOpprettettom} />
                </VStack>
              </MyBeautifulFormFieldWrapper>
              <MyBeautifulFormFieldWrapper>
                <FormField form={form} formField={formFields.årsak} />
              </MyBeautifulFormFieldWrapper>
              <MyBeautifulFormFieldWrapper>
                <FormField form={form} formField={formFields.oppgave} />
              </MyBeautifulFormFieldWrapper>
              <MyBeautifulFormFieldWrapper>
                <FormField form={form} formField={formFields.status} />
              </MyBeautifulFormFieldWrapper>
            </HStack>
            <HStack gap={'2'}>
              <Button size={'small'}>Bruk filter</Button>
              <Button size={'small'} variant={'tertiary'}>
                Nullstill
              </Button>
            </HStack>
          </div>
        </div>
      )}
    </div>
  );
};

function MyBeautifulFormFieldWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      height={'fit-content'}
      borderColor={'border-divider'}
      borderWidth={'2'}
      borderRadius={'xlarge'}
      paddingInline={'4'}
      paddingBlock={'4'}
    >
      {children}
    </Box>
  );
}
