'use client';

import { BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';

import styles from './Filtrering.module.css';
import { useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaverTotalt?: number;
  antallOppgaverIFilter?: number;
}

export const Filtrering = ({ form, formFields, antallOppgaverIFilter, antallOppgaverTotalt }: Props) => {
  const [visFilter, setVisFilter] = useState(false);

  return (
    <div className={styles.wrapper}>
      <HStack justify={'space-between'} align={'end'} className={styles.filtreringTop}>
        <HStack gap={'2'} align={'center'}>
          <Button
            icon={visFilter ? <XMarkIcon /> : <FilterIcon />}
            iconPosition={'right'}
            variant={'secondary'}
            size={'small'}
            onClick={() => setVisFilter(!visFilter)}
          >
            {visFilter ? 'Lukk filter' : 'Filtrer listen'}
          </Button>
          <div></div>
        </HStack>
        <Detail>
          Viser {antallOppgaverIFilter} av totalt {antallOppgaverTotalt} oppgaver
        </Detail>
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
              <Button
                size={'small'}
                variant={'tertiary'}
                onClick={() => {
                  form.reset();
                }}
              >
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
