import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';
import React from 'react';
import styles from './HelseinstitusjonOppholdGruppe.module.css';
import {
  formatDatoMedMånedsnavn,
  formaterDatoForFrontend,
  parseDatoFraDatePicker,
  uendeligSluttString,
} from 'lib/utils/date';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErReduksjonEllerIkke } from 'components/periodisering/VurderingStatusTag';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';

import { Dato } from 'lib/types/Dato';

import { HelseinstitusjonsFormFieldsNy } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/HelseinstitusjonNy';
import { HelseinstitusjonsvurderingNy } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/helseinstitusjonvurderingny/HelseinstitusjonVurderingNy';
import { erReduksjonUtIFraFormFields, erReduksjonUtIFraVurdering } from 'lib/utils/institusjonopphold';
import { HelseinstitusjonTidligereVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjonny/helseinstitusjontidligerevurdering/HelseinstitusjonTidligereVurdering';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFieldsNy>;
  oppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  tidligereVurderinger?: HelseInstiusjonVurdering[] | null;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
}

export const HelseinstitusjonOppholdGruppe = ({
  form,
  oppholdIndex,
  tidligereVurderinger,
  accordionsSignal,
  readonly: formReadOnly,
  opphold,
  erAktivUtenAvbryt,
}: Props) => {
  const {
    fields: vurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`,
  });

  const foersteNyePeriode =
    vurderinger.length > 0
      ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.0.periode.fom`)
      : null;

  return (
    <Box
      background="surface-default"
      padding="0"
      borderRadius="xlarge"
      borderWidth="1"
      borderColor="border-subtle"
      className={styles.oppholdGruppe}
    >
      {/* OPPHOLDET */}
      <Box background="surface-subtle" padding="3" className={styles.oppholdHeader}>
        <HStack gap="4" align="center">
          <Buildings3Icon title={`Helseinstitusjon${opphold.kildeinstitusjon}`} fontSize="1.5rem" aria-hidden />
          <div>
            <BodyShort className={styles.detailgray}>
              {opphold.kildeinstitusjon} - {opphold.oppholdstype}
            </BodyShort>
            <Label size="medium">
              Vurder perioden {formatDatoMedMånedsnavn(opphold.oppholdFra)} -{' '}
              {!datoErUendeligSlutt(opphold.avsluttetDato)
                ? formatDatoMedMånedsnavn(opphold.avsluttetDato)
                : 'Pågående'}
            </Label>
          </div>
        </HStack>
      </Box>

      {/* VURDERINGER */}
      <Box padding="4">
        <VStack gap="0">
          {tidligereVurderinger?.map((vurdering) => {
            return (
              <TidligereVurderingExpandableCard
                key={vurdering.periode.fom}
                fom={new Dato(vurdering.periode.fom).dato}
                tom={new Dato(vurdering.periode.tom).dato}
                foersteNyePeriodeFraDato={foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode)}
                vurderingStatus={getErReduksjonEllerIkke(erReduksjonUtIFraVurdering(vurdering))}
              >
                <HelseinstitusjonTidligereVurdering vurdering={vurdering} />
              </TidligereVurderingExpandableCard>
            );
          })}

          {vurderinger.map((vurdering, vurderingIndex) => {
            const reduksjon = erReduksjonUtIFraFormFields(
              form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}`)
            );

            const vurderingFom = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`
            );

            const fraDato =
              gyldigDatoEllerNull(vurderingFom) ??
              (vurderingIndex === 0 && !tidligereVurderinger?.length ? new Dato(opphold.oppholdFra).dato : null);

            return (
              <div key={vurderingIndex} className={styles.vurderingRad}>
                <NyVurderingExpandableCard
                  key={vurdering.id || vurderingIndex}
                  accordionsSignal={accordionsSignal}
                  fraDato={fraDato}
                  nestePeriodeFraDato={gyldigDatoEllerNull(
                    form.watch(
                      `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex + 1}.periode.fom`
                    )
                  )}
                  isLast={vurderingIndex === vurderinger.length - 1}
                  vurderingStatus={getErReduksjonEllerIkke(reduksjon)}
                  vurdering={vurdering}
                  harTidligereVurderinger={!!(tidligereVurderinger && tidligereVurderinger.length > 0)}
                  finnesFeil={false}
                  onSlettVurdering={() => remove(vurderingIndex)}
                  index={vurderingIndex}
                  readonly={formReadOnly}
                  initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
                >
                  <HelseinstitusjonsvurderingNy
                    form={form}
                    oppholdIndex={oppholdIndex}
                    vurderingIndex={vurderingIndex}
                    readonly={formReadOnly}
                    opphold={opphold}
                    finnesTidligereVurderinger={Array.isArray(tidligereVurderinger) && tidligereVurderinger.length > 0}
                  />
                </NyVurderingExpandableCard>
              </div>
            );
          })}
        </VStack>
      </Box>

      {!formReadOnly && (
        <Box padding="3">
          <Button
            type="button"
            className="fit-content"
            variant="secondary"
            size="small"
            onClick={() =>
              append({
                oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
                begrunnelse: '',
                harFasteUtgifter: undefined,
                forsoergerEktefelle: undefined,
                faarFriKostOgLosji: undefined,
                periode: {
                  fom: '',
                  tom: formaterDatoForFrontend(opphold.avsluttetDato || ''),
                },
                erNyVurdering: true,
                behøverVurdering: false,
              })
            }
          >
            Legg til ny vurdering
          </Button>
        </Box>
      )}
    </Box>
  );
};

function datoErUendeligSlutt(date: string) {
  return date === uendeligSluttString;
}
