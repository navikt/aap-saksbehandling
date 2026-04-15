'use client';

import { BodyShort, Box, Button, Chips, Detail, HGrid, HStack, VStack } from '@navikt/ds-react';

import styles from '../Filtrering.module.css';
import { useEffect, useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { aktiveFiltreringer, ALLE_OPPGAVER_ID } from 'components/oppgaveliste/filtrering/filtreringUtils';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaver?: number;
  aktivKøId: number;
  sattBehandlingstyperFilter: string[];
}

export const LedigeOppgaverFiltrering = ({
  form,
  formFields,
  antallOppgaver,
  aktivKøId,
  sattBehandlingstyperFilter,
}: Props) => {
  const [åpneFilter, setÅpneFilter] = useState(false);

  const aktiveFilter = aktiveFiltreringer(form.watch());
  useEffect(() => {
    if (sattBehandlingstyperFilter?.length) {
      form.setValue('behandlingstyper', sattBehandlingstyperFilter);
    }
  }, [sattBehandlingstyperFilter, form]);

  return (
    <div className={styles.wrapper}>
      <HStack justify={'space-between'} align={'center'} className={styles.filtreringTop}>
        <HStack gap={"space-8"} align={'center'}>
          <Button
            icon={åpneFilter ? <XMarkIcon /> : <FilterIcon />}
            iconPosition={'right'}
            variant={'secondary'}
            size={'small'}
            onClick={() => setÅpneFilter(!åpneFilter)}
          >
            {åpneFilter ? 'Lukk filter' : 'Filtrer listen'}
          </Button>
          {aktiveFilter.length > 0 && (
            <HStack gap={"space-8"}>
              <BodyShort>Filtre: </BodyShort>
              <Chips size={'small'}>
                {aktiveFilter.map((filter) => {
                  return aktivKøId !== ALLE_OPPGAVER_ID && filter.key === 'behandlingstyper' ? (
                    <Chips.Toggle key={filter.value} checkmark={false} selected={true}>
                      {filter.label}
                    </Chips.Toggle>
                  ) : (
                    <Chips.Removable
                      key={filter.value}
                      onClick={() => {
                        const values = form.watch(filter.key);
                        if (Array.isArray(values)) {
                          const arrayUtenValgtFilter = values.filter((value) => value !== filter.value);
                          // saksbehandlere er ikke i mineoppgaverfilteret og vi har derfor alltid string[]
                          form.setValue(filter.key, arrayUtenValgtFilter as string[]);
                        } else {
                          form.setValue(filter.key, undefined);
                        }
                      }}
                    >
                      {filter.label}
                    </Chips.Removable>
                  );
                })}
              </Chips>
            </HStack>
          )}
        </HStack>
        <Detail>Totalt {antallOppgaver} oppgaver</Detail>
      </HStack>
      {åpneFilter && (
        <div className={styles.filtreringwrapper}>
          <div className={styles.filtrering}>
            <HGrid columns={{ sm: 1, md: 2, lg: 4, xl: 5 }} gap={"space-8"}>
              <BoxWrapper>
                <FormField
                  form={form}
                  formField={formFields.behandlingstyper}
                  readOnly={ALLE_OPPGAVER_ID !== aktivKøId}
                />
              </BoxWrapper>
              <BoxWrapper>
                <VStack gap={"space-16"}>
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
            <HStack gap={"space-8"}>
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
      paddingInline={"space-16"}
      paddingBlock={"space-16"}
    >
      {children}
    </Box>
  );
}
