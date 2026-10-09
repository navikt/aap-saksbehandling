import { BodyShort, Box, Button, HStack, Label, Tag, VStack } from '@navikt/ds-react';
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
import { getReduksjonsstatus } from 'components/periodisering/VurderingStatusTag';
import { Dato } from 'lib/types/Dato';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonvurdering/HelseinstitusjonVurdering';
import {
  beregnStandardTidligsteReduksjonsdato,
  erReduksjonUtIFraFormFields,
  erReduksjonUtIFraVurdering,
  forrigeOppholdHarIngenReduksjonLengre,
} from 'lib/utils/institusjonopphold';
import { HelseinstitusjonTidligereVurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjontidligerevurdering/HelseinstitusjonTidligereVurdering';
import { CustomExpandableCard } from 'components/customexpandablecard/CustomExpandableCard';
import { addDays, isBefore } from 'date-fns';
import { Alert } from 'components/alert/Alert';
import { useFeatureFlag } from 'context/UnleashContext';
import { storForbokstavIHvertOrd } from 'lib/utils/string';
import { TidligereVurderingKortMedGap } from 'components/periodisering/tidligerevurderingkortmedgap/TidligereVurderingKortMedGap';
import { useEffektivTidligsteReduksjonsdato } from 'lib/utils/useEffektivTidligsteReduksjonsdato';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  tidligereVurderinger?: HelseInstiusjonVurdering[] | null;
  forrigeOppholdAvsluttetDato?: string | null;
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  skalJustereVedtatteVurderinger: boolean;
}

export const HelseinstitusjonOppholdGruppe = ({
  form,
  oppholdIndex,
  tidligereVurderinger,
  forrigeOppholdAvsluttetDato,
  forrigeOppholdVedtatteVurderinger,
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
  const visSammenhengendeOpphold = useFeatureFlag('SammenhengendeInstitusjonsopphold');

  const { reduksjonErMulig } = useEffektivTidligsteReduksjonsdato(
    form,
    oppholdIndex,
    opphold,
    forrigeOppholdAvsluttetDato,
    forrigeOppholdVedtatteVurderinger
  );

  const forrigeOppholdVurderinger =
    oppholdIndex > 0 ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.vurderinger`) : undefined;

  const forrigeHarIngenReduksjonLengre = forrigeOppholdHarIngenReduksjonLengre(
    forrigeOppholdVurderinger,
    forrigeOppholdVedtatteVurderinger
  );

  const standardTidligsteReduksjonsdato = beregnStandardTidligsteReduksjonsdato(opphold.oppholdFra);
  const liveVurderinger = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`);

  const harKorrigertEgenVurdering = liveVurderinger?.some((v) => {
    if (!erReduksjonUtIFraFormFields(v)) return false;
    const fom = v.periode?.fom;
    if (!fom || !/^\d{2}\.\d{2}\.\d{4}$/.test(fom)) return false;
    return !isBefore(new Dato(fom).dato, new Dato(standardTidligsteReduksjonsdato).dato);
  });

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
            <Label size="medium">
              Vurder perioden {formatDatoMedMånedsnavn(opphold.oppholdFra)} -{' '}
              {!datoErUendeligSlutt(opphold.avsluttetDato)
                ? formatDatoMedMånedsnavn(opphold.avsluttetDato)
                : 'Pågående'}
            </Label>
            {opphold.delperioder.length === 1 && (
              <BodyShort className={styles.detailgray}>{storForbokstavIHvertOrd(opphold.kildeinstitusjon)}</BodyShort>
            )}
            {visSammenhengendeOpphold && opphold.delperioder.length > 1 && (
              <VStack gap="space-2" className={styles.delperioder}>
                {opphold.delperioder.map((delperiode, i) => (
                  <BodyShort key={delperiode.institusjonsnavn + i} size="small" className={styles.detailgray}>
                    {storForbokstavIHvertOrd(delperiode.institusjonsnavn)}: {formatDatoMedMånedsnavn(delperiode.fom)} –{' '}
                    {formatDatoMedMånedsnavn(delperiode.tom)}
                  </BodyShort>
                ))}
              </VStack>
            )}
          </div>
        </HStack>
      </Box>
      {/* VURDERINGER */}
      <Box padding="space-16">
        <VStack gap="space-0">
          {tidligereVurderinger
            ?.filter((v) => {
              if (v.erHistoriskUtenReduksjonsberegning) return true;
              const starterFørOppholdSlutt = v.periode.fom <= opphold.avsluttetDato;
              const slutterEtterOppholdStart = v.periode.tom >= opphold.oppholdFra;
              return starterFørOppholdSlutt && slutterEtterOppholdStart;
            })
            .sort((a, b) => sorterEtterEldsteDato(a.periode.fom, b.periode.fom))
            .map((vurdering, index, alle) => {
              const erSiste = index === alle.length - 1;
              const justertTomDato =
                erSiste && skalJustereVedtatteVurderinger ? oppholdAvsluttetDato : new Dato(vurdering.periode.tom).dato;

              const visOppdateringsvarsel =
                erSiste &&
                erReduksjonUtIFraVurdering(vurdering) &&
                forrigeHarIngenReduksjonLengre &&
                !harKorrigertEgenVurdering;

              const innsendingsfeil =
                form.formState.errors.helseinstitusjonsvurderinger?.[oppholdIndex]?.vurderinger?.message;

              return (
                <React.Fragment key={vurdering.periode.fom}>
                  {visOppdateringsvarsel && (
                    <Alert variant="warning" className="fit-content" style={{ marginBottom: 'var(--a-spacing-2)' }}>
                      Reduksjonen i forrige opphold er fjernet for hele perioden. Denne reduksjonsdatoen kan være satt
                      basert på 1-månedsregelen, som ikke lenger gjelder. Normal regel tilsier tidligst{' '}
                      {formatDatoMedMånedsnavn(new Dato(standardTidligsteReduksjonsdato).dato)}. Vurder å legge til en
                      ny vurdering med korrigert dato.
                    </Alert>
                  )}
                  {innsendingsfeil && (
                    <Alert variant="error" className="fit-content" style={{ marginBottom: 'var(--a-spacing-2)' }}>
                      {innsendingsfeil}
                    </Alert>
                  )}
                  <TidligereVurderingKortMedGap
                    fom={new Dato(vurdering.periode.fom).dato}
                    tom={justertTomDato}
                    førsteNyePeriodeFraDato={
                      foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode)
                    }
                    vurderingStatus={getReduksjonsstatus(
                      erReduksjonUtIFraVurdering(vurdering),
                      vurdering.erHistoriskUtenReduksjonsberegning
                    )}
                    vurderingerMeta={vurdering.vurderingerMeta}
                  >
                    <HelseinstitusjonTidligereVurdering vurdering={vurdering} />
                  </TidligereVurderingKortMedGap>
                </React.Fragment>
              );
            })}

          {vurderinger.map((vurdering, vurderingIndex) => {
            const reduksjon = erReduksjonUtIFraFormFields(
              form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}`)
            );

            // Eksisterende (allerede lagrede) vurderinger beholder status fra lagring.
            // Kun nye vurderinger (lagt til nå i skjemaet) får status beregnet live,
            // siden disse ikke har noen persistert erHistoriskUtenReduksjonsberegning ennå.
            const erHistoriskUtenReduksjonsberegning = vurdering.erNyVurdering
              ? reduksjon && !reduksjonErMulig
              : (vurdering.erHistoriskUtenReduksjonsberegning ?? false);

            const vurderingFom = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`
            );

            const fraDato =
              gyldigDatoEllerNull(vurderingFom) ??
              (vurderingIndex === 0 && !tidligereVurderinger?.length ? new Dato(opphold.oppholdFra).dato : null);

            return (
              <div key={vurdering.oppholdId + vurderingIndex} className={styles.vurderingRad}>
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
                  vurderingStatus={getReduksjonsstatus(reduksjon, erHistoriskUtenReduksjonsberegning)}
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
                    forrigeOppholdAvsluttetDato={forrigeOppholdAvsluttetDato}
                    forrigeOppholdVedtatteVurderinger={forrigeOppholdVedtatteVurderinger}
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
                <HStack justify={'space-between'} padding={'space-8'}>
                  <BodyShort size={'small'}>{formatDatoMedMånedsnavn(addDays(oppholdAvsluttetDato, 1))} – </BodyShort>
                  <Tag data-color="neutral" size="xsmall" variant={'moderate'}>
                    Ikke relevant
                  </Tag>
                </HStack>
              }
            >
              <VStack>
                <Alert variant={'info'} className={'fit-content'}>
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
