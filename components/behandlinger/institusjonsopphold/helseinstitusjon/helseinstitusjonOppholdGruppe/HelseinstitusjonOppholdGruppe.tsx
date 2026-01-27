import { BodyShort, Box, Button, HStack, Label, VStack } from '@navikt/ds-react';
import { Buildings3Icon } from '@navikt/aksel-icons';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonsvurdering/Helseinstitusjonsvurdering';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { HelseinstitusjonGrunnlag } from 'lib/types/types';
import React from 'react';
import styles from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonOppholdGruppe/HelseinstitusjonOppholdGruppe.module.css';
import {
  DATO_FORMATER,
  formatDatoMedMånedsnavn,
  formaterDatoForFrontend,
  formaterDatoMedKunDagOgMånedForFrontend,
} from 'lib/utils/date';
import { JaEllerNei } from 'lib/utils/form';
import { beregnReduksjonsdatoVedNyttOpphold, beregnTidligsteReduksjonsdato } from 'lib/utils/institusjonsopphold';
import { parse } from 'date-fns';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErReduksjonEllerIkke } from 'components/periodisering/VurderingStatusTag';
import { AccordionsSignal } from 'hooks/AccordionSignalHook';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  accordionsSignal: AccordionsSignal;
  minFomDato?: string;
  alleOpphold: HelseinstitusjonGrunnlag['opphold'];
}

export const HelseinstitusjonOppholdGruppe = ({
  form,
  oppholdIndex,
  accordionsSignal,
  readonly: formReadOnly,
  opphold,
  alleOpphold,
}: Props) => {
  // Beregn riktig fom for ny vurdering
  const beregnFomForNyVurdering = () => {
    // Hvis det er første opphold, bruk standard regel
    if (oppholdIndex === 0) {
      return beregnTidligsteReduksjonsdato(opphold.oppholdFra);
    }

    // Hvis det er påfølgende opphold, sjekk om forrige opphold har sluttdato
    const forrigeOpphold = alleOpphold[oppholdIndex - 1]; //FIXME Thao: Sjekk om denne stemmer for andre opphold
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

  const {
    fields: vurderinger,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`,
  });

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
          {vurderinger.map((vurdering, vurderingIndex) => {
            const erFørsteVurdering = vurderingIndex === 0;

            const faarFriKostOgLosji = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.faarFriKostOgLosji`
            );
            const forsoergerEktefelle = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.forsoergerEktefelle`
            );
            const harFasteUtgifter = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.harFasteUtgifter`
            );

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
              !vurdering.begrunnelse ||
              vurdering.begrunnelse.trim() === '';
            const periodeLabel = erNyVurdering ? 'Ny vurdering:' : 'Vurdering:';
            const periodeTekst = (() => {
              if (ikkeValgt || !vurdering?.periode.fom) return '[Ikke valgt]';

              const fomDate = parse(vurdering.periode.fom, DATO_FORMATER.ddMMyyyy, new Date());
              const tomDate = parse(vurdering.periode.tom, DATO_FORMATER.ddMMyyyy, new Date());
              const fom = Number.isNaN(fomDate.getTime()) ? '[Ugyldig dato]' : formaterDatoForFrontend(fomDate);
              const tom =
                vurdering.periode.tom && !Number.isNaN(tomDate.getTime())
                  ? ` – ${formaterDatoForFrontend(tomDate)}`
                  : '';
              return `${fom}${tom}`;
            })();

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
                  initiellEkspandert={true}
                >
                  <div className={styles.vurderingWrapper}>
                    <div className={styles.vurderingContent}>
                      <Helseinstitusjonsvurdering
                        form={form}
                        oppholdIndex={oppholdIndex}
                        vurderingIndex={vurderingIndex}
                        readonly={formReadOnly}
                        opphold={opphold}
                        minFomDato={vurderingIndex > 0 ? vurderinger[vurderingIndex - 1]?.periode?.fom : undefined}
                      />
                    </div>
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
            onClick={() =>
              append({
                oppholdId: opphold.oppholdId,
                begrunnelse: '',
                harFasteUtgifter: undefined,
                forsoergerEktefelle: undefined,
                faarFriKostOgLosji: undefined,
                periode: {
                  fom: beregnFomForNyVurdering(),
                  tom: formaterDatoForFrontend(opphold.avsluttetDato || opphold.oppholdFra),
                },
                status: 'UAVKLART',
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
