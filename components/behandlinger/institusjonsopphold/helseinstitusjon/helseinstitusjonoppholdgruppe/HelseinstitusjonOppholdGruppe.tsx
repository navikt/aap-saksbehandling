import { Alert, BodyShort, Box, Button, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';
import React, { useState } from 'react';
import styles from './HelseinstitusjonOppholdGruppe.module.css';
import {
  formatDatoMedMånedsnavn,
  formaterDatoForFrontend,
  parseDatoFraDatePicker,
  sorterEtterEldsteDato,
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
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonvurdering/HelseinstitusjonVurdering';
import { erReduksjonUtIFraFormFields, erReduksjonUtIFraVurdering } from 'lib/utils/institusjonopphold';
import { HelseinstitusjonTidligereVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjontidligerevurdering/HelseinstitusjonTidligereVurdering';
import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { addDays } from 'date-fns';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  tidligereVurderinger?: HelseInstiusjonVurdering[] | null;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  skalJustereVedtatteVurderinger: boolean;
}

export const HelseinstitusjonOppholdGruppe = ({
  form,
  oppholdIndex,
  tidligereVurderinger,
  accordionsSignal,
  readonly: formReadOnly,
  opphold,
  erAktivUtenAvbryt,
  skalJustereVedtatteVurderinger,
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

  const oppholdAvsluttetDato = new Dato(opphold.avsluttetDato).dato;
  const [cardExpanded, setCardExpanded] = useState<boolean>(true);

  return (
    <Box
      background="default"
      padding="space-0"
      borderRadius="12"
      borderWidth="1"
      borderColor="neutral-subtle"
      className={styles.oppholdGruppe}
    >
      {/* OPPHOLDET */}
      <Box background="neutral-soft" padding="space-12" className={styles.oppholdHeader}>
        <HStack gap="space-16" align="center">
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
      <Box padding="space-16">
        <VStack gap="space-0">
          {tidligereVurderinger
            ?.filter((v) => {
              const starterFørOppholdSlutt = v.periode.fom <= opphold.avsluttetDato;
              const slutterEtterOppholdStart = v.periode.tom >= opphold.oppholdFra;
              return starterFørOppholdSlutt && slutterEtterOppholdStart;
            })
            .sort((a, b) => sorterEtterEldsteDato(a.periode.fom, b.periode.fom))
            .map((vurdering, index, alle) => {
              const erSiste = index === alle.length - 1;

              const justertTomDato =
                erSiste && skalJustereVedtatteVurderinger ? oppholdAvsluttetDato : new Dato(vurdering.periode.tom).dato;

              return (
                <TidligereVurderingExpandableCard
                  key={vurdering.periode.fom}
                  fom={new Dato(vurdering.periode.fom).dato}
                  tom={justertTomDato}
                  foersteNyePeriodeFraDato={
                    foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode)
                  }
                  vurderingStatus={getErReduksjonEllerIkke(erReduksjonUtIFraVurdering(vurdering))}
                  vurdertAv={vurdering.vurdertAv}
                  kvalitetssikretAv={undefined}
                  besluttetAv={undefined}
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
                  <Helseinstitusjonsvurdering
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

          {skalJustereVedtatteVurderinger && (
            <CustomExpandableCard
              editable={false}
              disabled={true}
              expanded={cardExpanded}
              setExpanded={setCardExpanded}
              heading={
                <HStack justify={'space-between'} padding={"space-8"}>
                  <BodyShort size={'small'}>{formatDatoMedMånedsnavn(addDays(oppholdAvsluttetDato, 1))} – </BodyShort>
                  <Tag data-color="neutral" size="xsmall" variant={"moderate"}>
                    Ikke relevant
                  </Tag>
                </HStack>
              }
            >
              <VStack>
                <Alert size="small" variant={'info'} className={'fit-content'}>
                  Vilkåret kan bare vurderes innenfor oppholdsperioden.
                </Alert>
              </VStack>
            </CustomExpandableCard>
          )}
        </VStack>
      </Box>
      {!formReadOnly && (
        <Box padding="space-12">
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
