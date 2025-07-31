'use client';

import { BodyShort, Box, Button, Chips, Detail, HGrid, HStack, VStack } from '@navikt/ds-react';

import styles from 'components/oppgaveliste/filtrering/Filtrering.module.css';
import { useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver2';
import { aktiveFiltreringer } from 'components/oppgaveliste/filtrering/filtreringUtils';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaverTotalt?: number;
  antallOppgaverIFilter?: number;
}

export const MineOppgaverFiltrering = ({ form, formFields, antallOppgaverIFilter, antallOppgaverTotalt }: Props) => {
  const [visFilter, setVisFilter] = useState(false);

  const aktiveFilter = aktiveFiltreringer(form.watch());

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
          <HStack gap={'2'}>
            <Chips size={'small'}>
              {aktiveFilter.map((filter) => (
                <Chips.Removable
                  key={filter.value}
                  onClick={() => {
                    const values = form.watch(filter.key);
                    if (Array.isArray(values)) {
                      const arrayUtenValgtFilter = values.filter((value) => value !== filter.value);
                      form.setValue(filter.key, arrayUtenValgtFilter);
                    } else {
                      form.setValue(filter.key, undefined);
                    }
                  }}
                >
                  {filter.label}
                </Chips.Removable>
              ))}
            </Chips>
          </HStack>
        </HStack>
        <Detail>
          Viser {antallOppgaverIFilter} av totalt {antallOppgaverTotalt} oppgaver
        </Detail>
      </HStack>

      {visFilter && (
        <div className={styles.filtreringwrapper}>
          <div className={styles.filtrering}>
            <HGrid columns={{ sm: 1, md: 2, lg: 4, xl: 5 }} gap={'2'}>
              <BoxWrapper>
                <FormField form={form} formField={formFields.behandlingstyper} />
              </BoxWrapper>
              <BoxWrapper>
                <VStack gap={'4'}>
                  <BodyShort size={'small'} weight={'semibold'}>
                    Behandling opprettet
                  </BodyShort>
                  <FormField form={form} formField={formFields.behandlingOpprettetFom} />
                  <FormField form={form} formField={formFields.behandlingOpprettetTom} />
                </VStack>
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.årsaker} />
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.avklaringsbehov} />
              </BoxWrapper>
              <BoxWrapper>
                <FormField form={form} formField={formFields.statuser} />
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
