'use client';

import { BodyShort, Box, Button, Detail, HGrid, HStack, VStack } from '@navikt/ds-react';

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
      <HStack justify={'space-between'} align={'center'} className={styles.filtreringTop}>
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
            <HGrid columns={{ sm: 1, md: 2, lg: 5 }} gap={'2'}>
              <BoxWrapper>
                <FormField form={form} formField={formFields.behandlingstype} />
              </BoxWrapper>
              <BoxWrapper>
                <VStack gap={'4'}>
                  <BodyShort size={'small'} weight={'semibold'}>
                    Behandling opprettet
                  </BodyShort>
                  <FormField form={form} formField={formFields.behandlingOpprettetFom} />
                  <FormField form={form} formField={formFields.behandlingOpprettettom} />
                </VStack>
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.årsak} />
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.oppgave} />
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.status} />
              </BoxWrapper>
            </HGrid>
            <HStack gap={'2'}>
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

function BoxWrapper({ children }: { children: React.ReactNode }) {
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
