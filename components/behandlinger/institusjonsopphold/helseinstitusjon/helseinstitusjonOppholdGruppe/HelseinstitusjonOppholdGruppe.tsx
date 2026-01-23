import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Buildings3Icon, TrashFillIcon } from '@navikt/aksel-icons';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import React, { useState } from 'react';
import styles from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe.module.css';
import { DATO_FORMATER, formaterDatoForFrontend } from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { beregnReduksjonsdatoVedNyttOpphold, beregnTidligsteReduksjonsdato } from 'lib/utils/institusjonsopphold';
import { parse } from 'date-fns';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';

interface Props {
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  vurderinger: Array<{
    field: FieldArrayWithId<HelseinstitusjonsFormFields, 'helseinstitusjonsvurderinger'>;
    index: number;
    vurdering: HelseinstitusjonGrunnlag['vurderinger'][0];
  }>;
  oppholdIndex: number;
  alleOpphold: HelseinstitusjonGrunnlag['opphold'];
  fields: FieldArrayWithId<HelseinstitusjonsFormFields, 'helseinstitusjonsvurderinger'>[];
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  formReadOnly: boolean;
  onRemove: (index: number) => void;
  onInsert: (index: number, value: any) => void;
}

export const HelseinstitusjonOppholdGruppe = ({
  opphold,
  vurderinger,
  oppholdIndex,
  alleOpphold,
  fields,
  form,
  formReadOnly,
  onRemove,
  onInsert,
}: Props) => {
  const [allAccordionsOpenSignal, setAllAccordionsOpenSignal] = useState<boolean>();

  // Beregn riktig fom for ny vurdering
  const beregnFomForNyVurdering = (): string => {
    // Hvis det er første opphold, bruk standard regel
    if (oppholdIndex === 0) {
      return beregnTidligsteReduksjonsdato(opphold.oppholdFra);
    }

    // Hvis det er påfølgende opphold, sjekk om forrige opphold har sluttdato
    const forrigeOpphold = alleOpphold[oppholdIndex - 1];
    if (forrigeOpphold?.avsluttetDato) {
      const reduksjonsdato = beregnReduksjonsdatoVedNyttOpphold(forrigeOpphold.avsluttetDato, opphold.oppholdFra);
      // Hvis regelen gjelder (opphold innen 3 mnd), bruk den
      if (reduksjonsdato) {
        return reduksjonsdato;
      }
    }

    // Ellers bruk standard regel
    return beregnTidligsteReduksjonsdato(opphold.oppholdFra);
  };

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
              Vurder perioden {formaterDatoForFrontend(opphold.oppholdFra)} -{' '}
              {opphold.avsluttetDato ? formaterDatoForFrontend(opphold.avsluttetDato) : 'Pågående'}
            </Label>
          </div>
        </HStack>
      </Box>

      {/* VURDERINGER */}
      <Box padding="4">
        <VStack gap="0">
          {vurderinger.map(({ field, index, vurdering }, vurderingIndex) => {
            const erFørsteVurdering = vurderingIndex === 0;
            const forrigeVurdering = erFørsteVurdering ? undefined : vurderinger[vurderingIndex - 1].vurdering;

            const faarFriKostOgLosji = form.watch(`helseinstitusjonsvurderinger.${index}.faarFriKostOgLosji`);
            const forsoergerEktefelle = form.watch(`helseinstitusjonsvurderinger.${index}.forsoergerEktefelle`);
            const harFasteUtgifter = form.watch(`helseinstitusjonsvurderinger.${index}.harFasteUtgifter`);

            const { ikkeValgt, reduksjon, ikkeReduksjon } = (() => {
              const ikkeValgt =
                faarFriKostOgLosji === undefined && forsoergerEktefelle === undefined && harFasteUtgifter === undefined;
              const reduksjon =
                faarFriKostOgLosji === JaEllerNei.Ja &&
                forsoergerEktefelle === JaEllerNei.Nei &&
                harFasteUtgifter === JaEllerNei.Nei;
              const ikkeReduksjon = !reduksjon;
              return { ikkeValgt, reduksjon, ikkeReduksjon };
            })();

            const erNyVurdering =
              vurdering?.status === 'UAVKLART' ||
              !vurdering?.status ||
              !field.begrunnelse ||
              field.begrunnelse.trim() === '';
            const periodeLabel = erNyVurdering ? 'Ny vurdering:' : 'Vurdering:';
            const periodeTekst = (() => {
              if (ikkeValgt || !vurdering?.periode.fom) return '[Ikke valgt]';

              const fomDate = parse(field.periode.fom, DATO_FORMATER.ddMMyyyy, new Date());
              const tomDate = parse(field.periode.tom, DATO_FORMATER.ddMMyyyy, new Date());
              const fom = Number.isNaN(fomDate.getTime()) ? '[Ugyldig dato]' : formaterDatoForFrontend(fomDate);
              const tom =
                field.periode.tom && !Number.isNaN(tomDate.getTime()) ? ` – ${formaterDatoForFrontend(tomDate)}` : '';
              return `${fom}${tom}`;
            })();
            // const errorList = mapPeriodiserteVurderingerErrorList<HelseinstitusjonsFormFields>(form.formState.errors);

            return (
              <div key={field.id} className={styles.vurderingRad}>
                <NyVurderingExpandableCard
                  key={index}
                  allAccordionsOpenSignal={allAccordionsOpenSignal}
                  fraDato={gyldigDatoEllerNull(form.watch(`helseinstitusjonsvurderinger.${index}.periode.fom`))}
                  nestePeriodeFraDato={gyldigDatoEllerNull(
                    form.watch(`helseinstitusjonsvurderinger.${index + 1}.periode.fom`)
                  )}
                  isLast={index === vurderinger.length - 1}
                  oppfylt={reduksjon}
                  vurdertAv={undefined}
                  kvalitetssikretAv={undefined}
                  besluttetAv={undefined}
                  finnesFeil={false}
                  onSlettVurdering={() => onRemove(index)}
                  // harTidligereVurderinger={tidligereVurderinger.length > 0}
                  index={index}
                  readonly={formReadOnly}
                  initiellEkspandert={true}
                >
                  <div className={styles.vurderingWrapper}>
                    <div className={styles.vurderingContent}>
                      <Helseinstitusjonsvurdering
                        form={form}
                        helseinstitusjonoppholdIndex={index}
                        readonly={formReadOnly}
                        opphold={opphold}
                        forrigeVurderingStatus={forrigeVurdering?.status}
                        minFomDato={
                          vurderingIndex > 0 ? vurderinger[vurderingIndex - 1]?.field?.periode?.fom : undefined
                        }
                      />
                    </div>
                    {/*{!erFørsteVurdering && !formReadOnly && (
                      <Button
                        type="button"
                        icon={<TrashFillIcon aria-hidden />}
                        variant="tertiary"
                        size="medium"
                        onClick={() => onRemove(index)}
                        className={styles.deleteButton}
                      />
                    )}*/}
                  </div>
                </NyVurderingExpandableCard>
              </div>
            );
          })}
        </VStack>
      </Box>

      {!formReadOnly && vurderinger.length > 0 && (
        <Box padding="3" className={styles.oppholdButtom}>
          <Button
            type="button"
            className="fit-content"
            variant="secondary"
            size="small"
            onClick={() => {
              // Finn siste index i fields der oppholdId matcher
              const sisteIndexForOpphold = (() => {
                let idx = -1;
                for (let i = 0; i < fields.length; i++) {
                  if (fields[i].oppholdId === opphold.oppholdId) {
                    idx = i;
                  }
                }
                return idx;
              })();

              const insertIndex = sisteIndexForOpphold === -1 ? fields.length : sisteIndexForOpphold + 1;

              onInsert(insertIndex, {
                oppholdId: opphold.oppholdId,
                begrunnelse: '',
                harFasteUtgifter: undefined,
                forsoergerEktefelle: undefined,
                faarFriKostOgLosji: undefined,
                periode: {
                  fom: beregnFomForNyVurdering(),
                  tom: formaterDatoForFrontend(opphold.avsluttetDato || opphold.oppholdFra),
                },
              });
            }}
          >
            Legg til ny vurdering
          </Button>
        </Box>
      )}
    </Box>
  );
};
