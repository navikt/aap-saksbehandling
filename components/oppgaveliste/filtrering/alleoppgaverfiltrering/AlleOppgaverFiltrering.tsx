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

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  formFields: FormFields<FieldPath<FormFieldsFilter>, FormFieldsFilter>;
  antallOppgaver?: number;
  onFiltrerClick: () => void;
  kanFiltrere: boolean;
  valgteRader: number[];
  setValgteRader: Dispatch<SetStateAction<number[]>>;
  revalidateFunction: () => void;
}

export const AlleOppgaverFiltrering = ({
  form,
  formFields,
  antallOppgaver,
  onFiltrerClick,
  kanFiltrere,
  valgteRader,
  revalidateFunction,
  setValgteRader,
}: Props) => {
  const [åpneFilter, setÅpneFilter] = useState(false);
  const [kanBrukerFiltrere, setKanBrukerFiltrere] = useState<boolean>();
  const [isPendingFrigi, startTransitionFrigi] = useTransition();

  useEffect(() => {
    setKanBrukerFiltrere(kanFiltrere);
    if (!kanFiltrere) {
      setÅpneFilter(false);
      form.reset();
    }
  }, [kanFiltrere, form]);

  const aktiveFilter = aktiveFiltreringer(form.watch());

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
        <HStack gap={'4'}>
          {valgteRader.length > 0 && (
            <>
              <HStack gap={'2'} align={'baseline'}>
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
              </HStack>
              <div className={styles.divider} />
            </>
          )}

          <HStack gap={'2'} align={'center'}>
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
              <HStack gap={'2'}>
                <BodyShort>Filtre: </BodyShort>
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
            )}
          </HStack>
        </HStack>

        <Detail>Totalt {antallOppgaver} oppgaver</Detail>
      </HStack>
      {åpneFilter && (
        <div className={styles.filtreringwrapper}>
          <div className={styles.filtrering}>
            {kanBrukerFiltrere ? (
              <>
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
              </>
            ) : (
              <VStack gap={'2'}>
                <BodyShort size={'small'}>
                  Oppgavekøen har faste filtre. Hvis du vil filtrere selv går du ut av køen og kan tilpasse filtrene
                  videre.
                </BodyShort>
                <Button size={'small'} onClick={onFiltrerClick} className={'fit-content'}>
                  Tilpass filtrene selv
                </Button>
              </VStack>
            )}
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
