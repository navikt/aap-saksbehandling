'use client';

import { BodyShort, Box, Button, Chips, Detail, HGrid, HStack, VStack } from '@navikt/ds-react';

import styles from '../Filtrering.module.css';
import { Dispatch, SetStateAction, useEffect, useState, useTransition } from 'react';
import { FilterIcon, XMarkIcon } from '@navikt/aksel-icons';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FieldPath, UseFormReturn } from 'react-hook-form';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaver/MineOppgaver';
import { aktiveFiltreringer } from 'components/oppgaveliste/filtrering/filtreringUtils';
import { avreserverOppgaveClient } from 'lib/oppgaveClientApi';
import { isSuccess } from 'lib/utils/api';
import { useTildelOppgaver } from 'context/oppgave/TildelOppgaverContext';
import { SaksbehandlerFilterSøk } from 'components/oppgaveliste/filtrering/alleoppgaverfiltrering/SaksbehandlerFilterSøk';
import { hasProperty } from '@vitest/expect';
import { AktivKø } from 'hooks/oppgave/aktivkøHook';
import { Køtype } from 'lib/types/oppgaveTypes';
import { useFeatureFlag } from 'context/UnleashContext';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaver?: number;
  valgteRader: number[];
  setValgteRader: Dispatch<SetStateAction<number[]>>;
  revalidateFunction: () => void;
  aktivKø: AktivKø;
  sattBehandlingstyperFilter: string[];
  aktiveEnheter: string[];
}

export const AlleOppgaverFiltrering = ({
  form,
  formFields,
  antallOppgaver,
  valgteRader,
  revalidateFunction,
  setValgteRader,
  aktivKø,
  sattBehandlingstyperFilter,
  aktiveEnheter,
}: Props) => {
  const [åpneFilter, setÅpneFilter] = useState(false);
  const [isPendingFrigi, startTransitionFrigi] = useTransition();
  const { visModal, setOppgaveIder } = useTildelOppgaver();

  const aktiveFilter = aktiveFiltreringer(form.watch());
  const tilbakekrevingBelopFilter = useFeatureFlag('TilbakekrevingBelopFilter');

  useEffect(() => {
    if (sattBehandlingstyperFilter?.length) {
      form.setValue('behandlingstyper', sattBehandlingstyperFilter);
    }
  }, [sattBehandlingstyperFilter, form]);

  const frigiValgteOppgaver = async (oppgaver: number[]) => {
    startTransitionFrigi(async () => {
      const res = await avreserverOppgaveClient(oppgaver);
      if (isSuccess(res)) {
        revalidateFunction();
        setValgteRader([]);
      }
    });
  };

  return (
    <div className={styles.wrapper}>
      <HStack justify={'space-between'} align={'center'} className={styles.filtreringTop}>
        <HStack gap={"space-16"}>
          {valgteRader.length > 0 && (
            <>
              <HStack gap={"space-8"} align={'baseline'}>
                <Detail>{valgteRader.length} oppgaver valgt.</Detail>
                <Button
                  onClick={() => frigiValgteOppgaver(valgteRader)}
                  loading={isPendingFrigi}
                  type={'button'}
                  size={'small'}
                  variant={'secondary'}
                >
                  Frigi valgte oppgaver
                </Button>
                <Button
                  onClick={() => {
                    setOppgaveIder(valgteRader);
                    visModal();
                    setValgteRader([]);
                  }}
                  type={'button'}
                  size={'small'}
                  variant={'secondary'}
                >
                  Tildel valgte oppgaver
                </Button>
              </HStack>
              <div className={styles.divider} />
            </>
          )}

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
                  {aktiveFilter.map((filter) =>
                    aktivKø.type !== Køtype.ALLE_OPPGAVER && filter.key === 'behandlingstyper' ? (
                      <Chips.Toggle checkmark={false} selected={true} key={`${filter.key}-${filter.value}`}>
                        {filter.label}
                      </Chips.Toggle>
                    ) : (
                      <Chips.Removable
                        key={`${filter.key}-${filter.value}`}
                        onClick={() => {
                          const values = form.watch(filter.key);
                          if (Array.isArray(values)) {
                            const arrayUtenValgtFilter = values.filter((value) => {
                              // sjekk om filterelementet er ValuePair eller string
                              return typeof value === 'object' && hasProperty(value, 'value')
                                ? value.value !== filter.value
                                : value !== filter.value;
                            });
                            form.setValue(filter.key, arrayUtenValgtFilter as string[]);
                          } else {
                            form.setValue(filter.key, undefined);
                          }
                        }}
                      >
                        {filter.label}
                      </Chips.Removable>
                    )
                  )}
                </Chips>
              </HStack>
            )}
          </HStack>
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
                  readOnly={Køtype.ALLE_OPPGAVER !== aktivKø.type}
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
              <BoxWrapper>
                <SaksbehandlerFilterSøk form={form} enheter={aktiveEnheter} />
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
