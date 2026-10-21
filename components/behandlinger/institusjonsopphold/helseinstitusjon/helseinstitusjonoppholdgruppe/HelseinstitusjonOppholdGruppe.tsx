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
import { getReduksjonsstatus, VurderingStatus } from 'components/periodisering/VurderingStatusTag';
import { Dato } from 'lib/types/Dato';
import { HelseinstitusjonsFormFields } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/Helseinstitusjon';
import { Helseinstitusjonsvurdering } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonvurdering/HelseinstitusjonVurdering';
import {
  beregnStandardTidligsteReduksjonsdato,
  erReduksjonUtIFraFormFields,
  erReduksjonUtIFraVurdering,
  erVurderingHistorisk,
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
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';

interface Props {
  form: UseFormReturn<HelseinstitusjonsFormFields>;
  oppholdIndex: number;
  readonly: boolean;
  opphold: HelseinstitusjonGrunnlag['opphold'][0];
  vedtatteVurderinger: HelseinstitusjonGrunnlag['vedtatteVurderinger'];
  tidligereVurderinger?: HelseInstiusjonVurdering[] | null;
  forrigeOppholdVedtatteVurderinger?: HelseInstiusjonVurdering[] | null;
  accordionsSignal: AccordionsSignal;
  erAktivUtenAvbryt: boolean;
  skalJustereVedtatteVurderinger: boolean;
}

export const HelseinstitusjonOppholdGruppe = ({
  form,
  oppholdIndex,
  tidligereVurderinger,
  forrigeOppholdVedtatteVurderinger,
  vedtatteVurderinger,
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
  const enManedsregelEnabled = useFeatureFlag('Helseinstitusjon1Manedsregel');

  const { reduksjonErMulig } = useEffektivTidligsteReduksjonsdato(form, oppholdIndex, vedtatteVurderinger);

  const erLagretHistorisk = (v: HelseInstiusjonVurdering) =>
    enManedsregelEnabled && v.erHistoriskUtenReduksjonsberegning;

  const erEtterOppholdSlutt = (v: HelseInstiusjonVurdering) =>
    enManedsregelEnabled && !v.erHistoriskUtenReduksjonsberegning && v.periode.fom > opphold.avsluttetDato;

  const tidligereVurderingerForVisning = tidligereVurderinger
    ?.filter((v) => {
      if (erLagretHistorisk(v) || erEtterOppholdSlutt(v)) return true;
      const starterFørOppholdSlutt = v.periode.fom <= opphold.avsluttetDato;
      const slutterEtterOppholdStart = v.periode.tom >= opphold.oppholdFra;
      return starterFørOppholdSlutt && slutterEtterOppholdStart;
    })
    .sort((a, b) => sorterEtterEldsteDato(a.periode.fom, b.periode.fom));

  const sisteInnenforOppholdet = tidligereVurderingerForVisning?.findLast((v) => !erEtterOppholdSlutt(v));

  const foersteNyeVurdering =
    vurderinger.length > 0 ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.0`) : null;

  const foersteNyeErHistorisk =
    !!foersteNyeVurdering && erVurderingHistorisk(foersteNyeVurdering, reduksjonErMulig, enManedsregelEnabled);

  // Når ny vurdering er historisk (reduksjon rekker ikke innenfor oppholdet), lagres den av
  // backend som gjeldende for HELE oppholdets periode - ikke kun fra den inntastede datoen.
  // Bruk derfor oppholdFra som visningsgrense, slik at gammel vurdering vises som fullstendig
  // overskrevet i stedet for delvis "strukket" fram til en dato langt utenfor oppholdet.
  const parsedFoersteNyePeriode = foersteNyePeriode == null ? null : parseDatoFraDatePicker(foersteNyePeriode);

  const foersteNyePeriodeFraDatoForVisning = foersteNyeErHistorisk
    ? new Dato(opphold.oppholdFra).dato
    : parsedFoersteNyePeriode;

  const forrigeOppholdVurderinger =
    oppholdIndex > 0 ? form.watch(`helseinstitusjonsvurderinger.${oppholdIndex - 1}.vurderinger`) : undefined;

  const forrigeHarIngenReduksjonLengre = forrigeOppholdHarIngenReduksjonLengre(
    forrigeOppholdVurderinger,
    forrigeOppholdVedtatteVurderinger
  );

  const standardTidligsteReduksjonsdato = beregnStandardTidligsteReduksjonsdato(opphold.oppholdFra);
  const liveVurderinger = form.watch(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`);
  const erHistoriskVurdering = (v: (typeof liveVurderinger)[number]) =>
    erVurderingHistorisk(v, reduksjonErMulig, enManedsregelEnabled);

  const harKorrigertEgenVurdering = liveVurderinger?.some((v) => {
    if (!erReduksjonUtIFraFormFields(v)) return false;
    const fom = v.periode?.fom;
    if (!fom || !/^\d{2}\.\d{2}\.\d{4}$/.test(fom)) return false;
    return !isBefore(new Dato(fom).dato, new Dato(standardTidligsteReduksjonsdato).dato);
  });

  const sisteTidligereVurdering = tidligereVurderinger
    ?.filter((v) => {
      if (erLagretHistorisk(v)) return true;
      const starterFørOppholdSlutt = v.periode.fom <= opphold.avsluttetDato;
      const slutterEtterOppholdStart = v.periode.tom >= opphold.oppholdFra;
      return starterFørOppholdSlutt && slutterEtterOppholdStart;
    })
    .sort((a, b) => sorterEtterEldsteDato(a.periode.fom, b.periode.fom))
    .at(-1);

  const visOppdateringsvarsel =
    enManedsregelEnabled &&
    !!sisteTidligereVurdering &&
    erReduksjonUtIFraVurdering(sisteTidligereVurdering) &&
    forrigeHarIngenReduksjonLengre &&
    !harKorrigertEgenVurdering;

  const innsendingsfeil = form.formState.errors.helseinstitusjonsvurderinger?.[oppholdIndex]?.vurderinger?.message;

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
            {!visSammenhengendeOpphold && (
              <BodyShort className={styles.detailgray}>
                {opphold.kildeinstitusjon} - {opphold.oppholdstype}
              </BodyShort>
            )}
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
          {tidligereVurderingerForVisning?.map((vurdering) => {
            const erSiste = vurdering === sisteInnenforOppholdet;
            const erHistorisk = erLagretHistorisk(vurdering);
            const erUtenforOppholdet = erEtterOppholdSlutt(vurdering);
            const visningsStatus = erUtenforOppholdet
              ? VurderingStatus.Overskrevet
              : getReduksjonsstatus(erReduksjonUtIFraVurdering(vurdering), erHistorisk);

            let nyePerioderFraDato = foersteNyePeriodeFraDatoForVisning;
            if (erUtenforOppholdet) {
              nyePerioderFraDato = new Dato(opphold.oppholdFra).dato;
            } else if (erHistorisk) {
              nyePerioderFraDato = null;
            }

            const justertTomDato =
              !erHistorisk && erSiste && skalJustereVedtatteVurderinger
                ? oppholdAvsluttetDato
                : new Dato(vurdering.periode.tom).dato;

            if (!visSammenhengendeOpphold) {
              return (
                <TidligereVurderingExpandableCard
                  key={vurdering.periode.fom}
                  fom={new Dato(vurdering.periode.fom).dato}
                  tom={justertTomDato}
                  førsteNyePeriodeFraDato={erHistorisk ? null : foersteNyePeriodeFraDatoForVisning}
                  vurderingStatus={getReduksjonsstatus(erReduksjonUtIFraVurdering(vurdering), erHistorisk)}
                  vurderingerMeta={vurdering.vurderingerMeta}
                >
                  <HelseinstitusjonTidligereVurdering vurdering={vurdering} />
                </TidligereVurderingExpandableCard>
              );
            }

            return (
              <TidligereVurderingKortMedGap
                key={vurdering.periode.fom}
                fom={new Dato(vurdering.periode.fom).dato}
                tom={justertTomDato}
                førsteNyePeriodeFraDato={nyePerioderFraDato}
                visKunFomDato={erHistorisk || erUtenforOppholdet}
                vurderingStatus={visningsStatus}
                vurderingerMeta={vurdering.vurderingerMeta}
              >
                <HelseinstitusjonTidligereVurdering vurdering={vurdering} />
              </TidligereVurderingKortMedGap>
            );
          })}

          {vurderinger.map((vurdering, vurderingIndex) => {
            const liveVurdering = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}`
            );
            const reduksjon = erReduksjonUtIFraFormFields(liveVurdering);

            const erHistoriskUtenReduksjonsberegning = erVurderingHistorisk(
              liveVurdering,
              reduksjonErMulig,
              enManedsregelEnabled
            );

            const vurderingFom = form.watch(
              `helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger.${vurderingIndex}.periode.fom`
            );

            const fraDato =
              gyldigDatoEllerNull(vurderingFom) ??
              (vurderingIndex === 0 && !tidligereVurderinger?.length ? new Dato(opphold.oppholdFra).dato : null);

            const nestePeriodiserte = liveVurderinger?.slice(vurderingIndex + 1).find((v) => !erHistoriskVurdering(v));

            // Historisk vurdering har sin egen uavhengige periode (en enkelt dato langt utenfor
            // oppholdet, satt av saksbehandler). Den er IKKE en del av den sammenhengende kjeden
            // av periodiserte vurderinger, og skal derfor aldri få sin periode justert/strukket
            // basert på hvor neste (eller forrige) vurdering starter/slutter.
            const nestePeriodeFraDato = erHistoriskUtenReduksjonsberegning
              ? null
              : gyldigDatoEllerNull(nestePeriodiserte?.periode?.fom);

            const erSisteVurdering = erHistoriskUtenReduksjonsberegning || !nestePeriodiserte;

            return (
              <div key={vurdering.oppholdId + vurderingIndex} className={styles.vurderingRad}>
                <NyVurderingExpandableCard
                  key={vurdering.id || vurderingIndex}
                  accordionsSignal={accordionsSignal}
                  fraDato={fraDato}
                  nestePeriodeFraDato={nestePeriodeFraDato}
                  isLast={erSisteVurdering}
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
                    vedtatteVurderinger={vedtatteVurderinger}
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
            onClick={() => {
              form.clearErrors(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`);

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
              });
            }}
          >
            Legg til ny vurdering
          </Button>
        </Box>
      )}
      {(innsendingsfeil || visOppdateringsvarsel) && (
        <VStack gap="space-12" paddingInline="space-16" paddingBlock="space-0 space-12">
          {innsendingsfeil && (
            <Alert variant="error" className="fit-content">
              {innsendingsfeil}
            </Alert>
          )}
          {visOppdateringsvarsel && (
            <Alert variant="warning" className="fit-content">
              Reduksjonen i forrige opphold er fjernet for hele perioden. Denne reduksjonsdatoen kan være satt basert på
              1-månedsregelen, som ikke lenger gjelder. Normal regel tilsier tidligst{' '}
              {formatDatoMedMånedsnavn(new Dato(standardTidligsteReduksjonsdato).dato)}. Vurder å legge til en ny
              vurdering med korrigert dato.
            </Alert>
          )}
        </VStack>
      )}
    </Box>
  );
};

function datoErUendeligSlutt(date: string) {
  return date === uendeligSluttString;
}
