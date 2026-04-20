'use client';

import { BodyShort, Box, Button, Chips, Detail, HGrid, HStack, VStack } from '@navikt/ds-react';

import styles from 'components/oppgaveliste/filtrering/Filtrering.module.css';
import { useState } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { aktiveFiltreringer } from 'components/oppgaveliste/filtrering/filtreringUtils';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaverTotalt?: number;
  antallOppgaverIFilter?: number;
}

export const MineOppgaverFiltrering = ({ form, formFields, antallOppgaverIFilter, antallOppgaverTotalt }: Props) => {
  const [visFilter, setVisFilter] = useState(false);

  const aktiveFilter = aktiveFiltreringer(form.watch());
  const tilbakekrevingBelopFilter = useFeatureFlag('TilbakekrevingBelopFilter');

  return (
    <div className={styles.wrapper}>
      <HStack justify={'space-between'} align={'center'} className={styles.filtreringTop}>
        <HStack gap={"space-8"} align={'center'}>
          <Button
            icon={visFilter ? <XMarkIcon /> : <FilterIcon />}
            iconPosition={'right'}
            variant={'secondary'}
            size={'small'}
            onClick={() => setVisFilter(!visFilter)}
          >
            {visFilter ? 'Lukk filter' : 'Filtrer listen'}
          </Button>
          {aktiveFilter.length > 0 && (
            <HStack gap={"space-8"}>
              <BodyShort>Filtre: </BodyShort>
              <Chips size={'small'}>
                {aktiveFilter.map((filter) => (
                  <Chips.Removable
                    key={`${filter.key}-${filter.value}`}
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
                ))}
              </Chips>
            </HStack>
          )}
        </HStack>
        <Detail>
          Viser {antallOppgaverIFilter} av totalt {antallOppgaverTotalt} oppgaver
        </Detail>
      </HStack>
      {visFilter && (
        <div className={styles.filtreringwrapper}>
          <div className={styles.filtrering}>
            <HGrid columns={{ sm: 1, md: 2, lg: 4, xl: 5 }} gap={"space-8"}>
              <BoxWrapper>
                <FormField form={form} formField={formFields.behandlingstyper} />
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
              {tilbakekrevingBelopFilter && (
                <BoxWrapper>
                  <VStack gap={"space-16"}>
                    <BodyShort size={'small'} weight={'semibold'}>
                      Tilbakekrevingsbeløp
                    </BodyShort>
                    <FormField form={form} formField={formFields.tilbakekrevingBeløpFom} />
                    <FormField form={form} formField={formFields.tilbakekrevingBeløpTom} />
                  </VStack>
                </BoxWrapper>
              )}
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
      borderColor={"neutral-subtle"}
      borderWidth={'2'}
      borderRadius={"12"}
      paddingInline={"space-16"}
      paddingBlock={"space-16"}
    >
      {children}
    </Box>
  );
}
