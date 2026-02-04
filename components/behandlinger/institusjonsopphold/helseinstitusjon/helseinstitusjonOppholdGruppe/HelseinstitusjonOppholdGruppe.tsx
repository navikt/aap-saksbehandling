import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { HelseinstitusjonGrunnlag, HelseInstiusjonVurdering } from 'lib/types/types';
import React from 'react';
import styles from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe.module.css';
import { formatDatoMedMånedsnavn, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { addDays } from 'date-fns';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErReduksjonEllerIkke } from 'components/periodisering/VurderingStatusTag';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { HelseinstitusjonTidligereVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjontidligerevurdering/HelseinstitusjonTidligereVurdering';
import { Dato } from 'lib/types/Dato';
import { erReduksjonUtIFraFormFields, erReduksjonUtIFraVurdering } from 'lib/utils/institusjonsopphold';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
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

  function beregnFraOgMedDatoForNyVurdering() {
    const oppholdForm = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`);
    const forrigeVurdering = form.watch(
      `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${oppholdForm.length - 1}`
    );

    // TODO Fiks her ved revurdering så skal fom dato være dagen etter forrige (tidligere vurderinger)

    const forrigeFom = forrigeVurdering?.periode?.fom;

    return forrigeFom
      ? formaterDatoForFrontend(addDays(new Dato(forrigeFom).dato, 1))
      : new Dato(opphold.oppholdFra).formaterForFrontend();
  }

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
              {opphold.avsluttetDato ? formatDatoMedMånedsnavn(opphold.avsluttetDato) : 'Pågående'}
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

            return (
              <div key={vurderingIndex} className={styles.vurderingRad}>
                <NyVurderingExpandableCard
                  key={vurdering.id || vurderingIndex}
                  accordionsSignal={accordionsSignal}
                  fraDato={gyldigDatoEllerNull(
                    form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`)
                  )}
                  nestePeriodeFraDato={gyldigDatoEllerNull(
                    form.watch(
                      `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex + 1}.periode.fom`
                    )
                  )}
                  isLast={vurderingIndex === vurderinger.length - 1}
                  vurderingStatus={getErReduksjonEllerIkke(reduksjon)}
                  vurdertAv={undefined}
                  kvalitetssikretAv={undefined}
                  besluttetAv={undefined}
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
                oppholdId: opphold.oppholdId,
                begrunnelse: '',
                harFasteUtgifter: undefined,
                forsoergerEktefelle: undefined,
                faarFriKostOgLosji: undefined,
                periode: {
                  fom: beregnFraOgMedDatoForNyVurdering(),
                  tom: formaterDatoForFrontend(opphold.avsluttetDato || ''),
                },
                erNyVurdering: true,
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
