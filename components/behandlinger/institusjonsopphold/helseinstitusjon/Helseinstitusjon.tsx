'use client';

import { VStack } from '@navikt/ds-react';
import { addDays, addMonths, format, isAfter, isBefore, parse, startOfMonth, subDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { Dato } from 'lib/types/Dato';
import { HelseinstitusjonGrunnlag, MellomlagretVurdering, Periode, VurderingFormMeta } from 'lib/types/types';
import { DATO_FORMATER, erUendeligSlutt, formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { SubmitEvent } from 'react';
import { useFieldArray } from 'react-hook-form';

import { InstitusjonsoppholdTabell } from 'components/behandlinger/institusjonsopphold/InstitusjonsoppholdTabell';
import { HelseinstitusjonOppholdGruppe } from 'components/behandlinger/institusjonsopphold/helseinstitusjon/helseinstitusjonoppholdgruppe/HelseinstitusjonOppholdGruppe';
import { useConfigForm } from 'components/form/FormHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { useFeatureFlag } from 'context/UnleashContext';
import {
  beregnStandardTidligsteReduksjonsdato,
  erNyttOppholdInnenfor3MaanederEtterSistOpphold,
  erReduksjonMuligForOpphold,
  erReduksjonUtIFraFormFields,
  forrigeOppholdHarIngenReduksjonLengre,
  manglerKorrigertReduksjonsdato,
} from 'lib/utils/institusjonopphold';

interface Props {
  grunnlag: HelseinstitusjonGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface HelseinstitusjonsFormFields {
  helseinstitusjonsvurderinger: OppholdMedVurderinger[];
}

export interface OppholdMedVurderinger {
  oppholdId: string;
  periode: Periode;
  tidligsteReduksjonsdato?: string | null;
  vurderinger: OppholdVurdering[];
}

export interface OppholdVurdering extends VurderingFormMeta {
  oppholdId: string;
  periode: Periode;
  begrunnelse: string;
  harFasteUtgifter?: JaEllerNei;
  forsoergerEktefelle?: JaEllerNei;
  faarFriKostOgLosji?: JaEllerNei;
  erHistoriskUtenReduksjonsberegning?: boolean;
}

type DraftFormFields = Partial<HelseinstitusjonsFormFields>;

export const Helseinstitusjon = ({ grunnlag, readOnly, behandlingVersjon, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('DU_ER_ET_ANNET_STED');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'DU_ER_ET_ANNET_STED',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag, grunnlag.opphold);

  const { form } = useConfigForm<HelseinstitusjonsFormFields>({
    helseinstitusjonsvurderinger: {
      type: 'fieldArray',
      defaultValue: defaultValue.helseinstitusjonsvurderinger,
    },
  });

  const { fields: oppholdFields } = useFieldArray({
    control: form.control,
    name: 'helseinstitusjonsvurderinger',
  });

  const { slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_HELSEINSTITUSJON,
    initialMellomlagretVurdering,
    form
  );

  const sammenhengendeOppholdEnabled = useFeatureFlag('SammenhengendeInstitusjonsopphold');

  const validerManglendeKorrigeringAvReduksjonsdato = (data: HelseinstitusjonsFormFields): boolean => {
    let harValideringsfeil = false;

    data.helseinstitusjonsvurderinger.forEach((opphold, oppholdIndex) => {
      const forrigeOpphold = oppholdIndex > 0 ? data.helseinstitusjonsvurderinger[oppholdIndex - 1] : undefined;
      const forrigeOppholdVedtatteVurderinger = forrigeOpphold
        ? grunnlag.vedtatteVurderinger
            .filter((v) => v.oppholdId === forrigeOpphold.oppholdId)
            .flatMap((v) => v.vurderinger || [])
        : undefined;

      const manglerKorrigering = manglerKorrigertReduksjonsdato(
        opphold.periode.fom,
        opphold.vurderinger,
        forrigeOpphold?.vurderinger,
        forrigeOppholdVedtatteVurderinger
      );

      if (manglerKorrigering) {
        harValideringsfeil = true;
        form.setError(`helseinstitusjonsvurderinger.${oppholdIndex}.vurderinger`, {
          type: 'manual',
          message:
            'Reduksjonen i forrige opphold er fjernet for hele perioden. Legg til en ny vurdering med korrigert reduksjonsdato før du bekrefter.',
        });
      }
    });

    return harValideringsfeil;
  };

  const byggVurderingerForInnsending = (data: HelseinstitusjonsFormFields) => {
    const parseDato = (dato: string) => parse(dato, 'dd.MM.yyyy', new Date());

    return data.helseinstitusjonsvurderinger.flatMap((opphold, oppholdIndex) => {
      const vedtatteForOpphold = grunnlag.vedtatteVurderinger
        .filter((v) => v.oppholdId === opphold.oppholdId)
        .flatMap((v) => v.vurderinger || []);
      const sisteVedtatteVurdering = vedtatteForOpphold.at(-1);
      const sisteVedtatteTom = sisteVedtatteVurdering?.periode.tom ?? null;

      // Finn forrige opphold sitt faktiske grunnlag (for avsluttetDato) og om saksbehandler
      // nå (live i skjemaet) har gitt reduksjon der - avgjør om 1-månedsregelen gjelder her.
      const forrigeOpphold = oppholdIndex > 0 ? data.helseinstitusjonsvurderinger[oppholdIndex - 1] : undefined;
      const forrigeOppholdFaktisk = forrigeOpphold
        ? grunnlag.opphold.find((o) => o.oppholdId === forrigeOpphold.oppholdId)
        : undefined;
      const forrigeOppholdVedtatteVurderinger = forrigeOpphold
        ? grunnlag.vedtatteVurderinger
            .filter((v) => v.oppholdId === forrigeOpphold.oppholdId)
            .flatMap((v) => v.vurderinger || [])
        : undefined;

      const forrigeGaReduksjonNå = forrigeOpphold?.vurderinger.some((v) => erReduksjonUtIFraFormFields(v)) ?? false;
      const innenforTreMåneder =
        !!forrigeOppholdFaktisk?.avsluttetDato &&
        erNyttOppholdInnenfor3MaanederEtterSistOpphold(forrigeOppholdFaktisk.avsluttetDato, opphold.periode.fom);
      const bruker1Månedsregelen = (forrigeGaReduksjonNå && innenforTreMåneder) satisfies boolean;

      let effektivTidligsteReduksjonsdato = opphold.tidligsteReduksjonsdato;
      if (bruker1Månedsregelen) {
        effektivTidligsteReduksjonsdato = format(
          startOfMonth(addMonths(new Dato(opphold.periode.fom).dato, 1)),
          'yyyy-MM-dd'
        );
      } else if (
        forrigeOppholdHarIngenReduksjonLengre(forrigeOpphold?.vurderinger, forrigeOppholdVedtatteVurderinger)
      ) {
        effektivTidligsteReduksjonsdato = beregnStandardTidligsteReduksjonsdato(opphold.periode.fom);
      }

      const nyeVurderinger = opphold.vurderinger.map((vurdering, index, filtrerteVurderinger) => {
        const nesteVurdering = filtrerteVurderinger.at(index + 1);
        const erReduksjon = erReduksjonUtIFraFormFields(vurdering);
        const erHistoriskUtenReduksjonsberegning =
          erReduksjon && !erReduksjonMuligForOpphold(opphold.periode.tom, effektivTidligsteReduksjonsdato);

        // Segmentets reelle start: enten den brukerinntastede datoen, eller - for historiske
        // vurderinger der datoen ligger utenfor oppholdet - starten på segmentet (forrige
        // vurderings slutt, eller oppholdets start for første segment). Dette sikrer at hele
        // oppholdets periode dekkes og overskriver gammel/vedtatt tidslinje korrekt.
        const segmentStart = index === 0 ? opphold.periode.fom : filtrerteVurderinger[index - 1]?.periode.fom;

        const fom = vurdering.periode?.fom
          ? formaterDatoForBackend(parseDato(vurdering.periode.fom))
          : formaterDatoForBackend(parseDato(opphold.periode.fom));

        const beregnetTom = nesteVurdering
          ? formaterDatoForBackend(subDays(new Dato(nesteVurdering.periode.fom).dato, 1))
          : formaterDatoForBackend(parseDato(opphold.periode.tom));

        /*// Periode krever tom >= fom. Ved historisk vurdering kan fom (saksbehandlers reduksjonsdato)
        // ligge etter oppholdets/beregnet tom -> juster tom opp til fom i så fall, siden perioden
        // uansett ikke brukes til reduksjonsberegning for historiske vurderinger.
        const tom =
          erHistoriskUtenReduksjonsberegning && isAfter(new Dato(fom).dato, new Dato(beregnetTom).dato)
            ? fom
            : beregnetTom;*/ // TODO Thao: Fjerne denne?

        let periodeFom = fom;
        let tom = beregnetTom;

        if (erHistoriskUtenReduksjonsberegning) {
          // Datoen saksbehandler har oppgitt ligger utenfor oppholdet (reduksjon rekker aldri å
          // inntreffe). Segmentet som faktisk sendes til backend må likevel dekke oppholdets
          // reelle periode fra forrige grense til oppholdets slutt, slik at det overskriver
          // eventuell gammel/vedtatt reduksjon i denne perioden.
          periodeFom = segmentStart
            ? formaterDatoForBackend(parseDato(segmentStart))
            : formaterDatoForBackend(parseDato(opphold.periode.fom));
          tom = formaterDatoForBackend(parseDato(opphold.periode.tom));
        }

        return {
          oppholdId: vurdering.oppholdId,
          begrunnelse: vurdering.begrunnelse,
          faarFriKostOgLosji: vurdering.faarFriKostOgLosji === JaEllerNei.Ja,
          forsoergerEktefelle: vurdering.forsoergerEktefelle === JaEllerNei.Ja,
          harFasteUtgifter: vurdering.harFasteUtgifter === JaEllerNei.Ja,
          periode: { fom: periodeFom, tom },
          erHistoriskUtenReduksjonsberegning,
        };
      });

      const førsteNyeFom = nyeVurderinger.at(0)?.periode.fom;

      const finnesGap =
        sammenhengendeOppholdEnabled &&
        sisteVedtatteVurdering &&
        sisteVedtatteTom &&
        førsteNyeFom &&
        isBefore(new Dato(sisteVedtatteTom).dato, new Dato(opphold.periode.tom).dato) &&
        isAfter(new Dato(førsteNyeFom).dato, addDays(new Dato(sisteVedtatteTom).dato, 1));

      const gapVurdering = finnesGap
        ? [
            {
              oppholdId: sisteVedtatteVurdering.oppholdId,
              begrunnelse: sisteVedtatteVurdering.begrunnelse,
              faarFriKostOgLosji: sisteVedtatteVurdering.faarFriKostOgLosji,
              forsoergerEktefelle: sisteVedtatteVurdering.forsoergerEktefelle,
              harFasteUtgifter: sisteVedtatteVurdering.harFasteUtgifter,
              periode: {
                fom: formaterDatoForBackend(addDays(new Dato(sisteVedtatteTom).dato, 1)),
                tom: formaterDatoForBackend(subDays(new Dato(førsteNyeFom).dato, 1)),
              },
              erHistoriskUtenReduksjonsberegning: false,
            },
          ]
        : [];

      return [...gapVurdering, ...nyeVurderinger];
    });
  };

  const handleSubmit = (event: SubmitEvent) => {
    form.handleSubmit((data) => {
      const harValideringsfeil = validerManglendeKorrigeringAvReduksjonsdato(data);
      if (harValideringsfeil) {
        return;
      }

      const vurderinger = byggVurderingerForInnsending(data);

      løsAvklaringsbehov(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
            helseinstitusjonVurdering: { vurderinger },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_INSTITUSJON_VARIGHET', umamiStartTidspunkt, Date.now());
          closeAllAccordions();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-25 Helseinstitusjon'}
      steg={'DU_ER_ET_ANNET_STED'}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      isLoading={løsAvklaringsbehovIsLoading}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag, grunnlag.opphold)))
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <VStack gap={'space-24'}>
        <InstitusjonsoppholdTabell
          label={'Brukeren har følgende institusjonsopphold på helseinstitusjon'}
          beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP-ytelse. '}
          instutisjonsopphold={grunnlag.opphold}
        />

        {oppholdFields.map((oppholdField, oppholdIndex) => {
          const faktiskOpphold = grunnlag.opphold.find((o) => o.oppholdId === oppholdField.oppholdId)!;
          const skalJustere = skalJustereVedtatteVurderinger(grunnlag, oppholdField.oppholdId);

          const tidligereVurderinger = grunnlag.vedtatteVurderinger
            .filter((v) => v.oppholdId === oppholdField.oppholdId)
            .flatMap((v) => v.vurderinger || []);

          const forrigeOppholdField = oppholdIndex > 0 ? oppholdFields[oppholdIndex - 1] : undefined;
          const forrigeOppholdFaktisk = forrigeOppholdField
            ? grunnlag.opphold.find((o) => o.oppholdId === forrigeOppholdField.oppholdId)
            : undefined;

          const forrigeOppholdVedtatteVurderinger = forrigeOppholdField
            ? grunnlag.vedtatteVurderinger
                .filter((v) => v.oppholdId === forrigeOppholdField.oppholdId)
                .flatMap((v) => v.vurderinger || [])
            : undefined;

          return (
            <HelseinstitusjonOppholdGruppe
              key={oppholdField.id}
              opphold={faktiskOpphold}
              tidligereVurderinger={tidligereVurderinger}
              forrigeOppholdAvsluttetDato={forrigeOppholdFaktisk?.avsluttetDato}
              forrigeOppholdVedtatteVurderinger={forrigeOppholdVedtatteVurderinger}
              accordionsSignal={accordionsSignal}
              oppholdIndex={oppholdIndex}
              form={form}
              readonly={formReadOnly}
              erAktivUtenAvbryt={erAktivUtenAvbryt}
              skalJustereVedtatteVurderinger={skalJustere}
            />
          );
        })}
      </VStack>
    </VilkårskortMedFormOgMellomlagring>
  );
};

function skalJustereVedtatteVurderinger(grunnlag: HelseinstitusjonGrunnlag, oppholdId: string): boolean {
  if (grunnlag.vedtatteVurderinger.length === 0) return false;

  const opphold = grunnlag.opphold.find((o) => o.oppholdId === oppholdId);
  if (!opphold || erUendeligSlutt(opphold.avsluttetDato)) return false;

  const harNyeVurderinger = grunnlag.vurderinger.some((v) => v.oppholdId === oppholdId);
  if (harNyeVurderinger) return false;

  const vedtatteForOpphold = grunnlag.vedtatteVurderinger
    .filter((v) => v.oppholdId === opphold.oppholdId)
    .flatMap((v) => v.vurderinger || []);
  if (!vedtatteForOpphold || vedtatteForOpphold.length === 0) return false;

  const sisteVedtatteTom = vedtatteForOpphold[vedtatteForOpphold.length - 1].periode.tom;
  return erUendeligSlutt(sisteVedtatteTom) || sisteVedtatteTom > opphold.avsluttetDato;
}

function mapVurderingToDraftFormFields(
  grunnlag: HelseinstitusjonGrunnlag,
  opphold: HelseinstitusjonGrunnlag['opphold']
): DraftFormFields {
  const harTidligerevurderinger = grunnlag.vedtatteVurderinger.length > 0;

  return {
    helseinstitusjonsvurderinger: opphold.map((opphold) => {
      const vurderingerForOpphold = grunnlag.vurderinger
        .filter((v) => v.oppholdId === opphold.oppholdId)
        .flatMap((v) => v.vurderinger || []);

      const vedtatteVurderingerForOpphold = grunnlag.vedtatteVurderinger.find(
        (v) => v.oppholdId === opphold.oppholdId
      )?.vurderinger;

      const oppholdAvsluttetDato = formaterDatoForFrontendMedStøtteForUendeligSlutt(opphold.avsluttetDato);
      const skalJustere = skalJustereVedtatteVurderinger(grunnlag, opphold.oppholdId || '');

      let vurderinger: OppholdVurdering[];

      if (vurderingerForOpphold && vurderingerForOpphold.length > 0) {
        vurderinger = vurderingerForOpphold.map((vurdering) => ({
          oppholdId: vurdering.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
          begrunnelse: vurdering.begrunnelse,
          harFasteUtgifter: getJaNeiEllerUndefined(vurdering.harFasteUtgifter),
          forsoergerEktefelle: getJaNeiEllerUndefined(vurdering.forsoergerEktefelle),
          faarFriKostOgLosji: getJaNeiEllerUndefined(vurdering.faarFriKostOgLosji),
          periode: {
            fom: formaterDatoForFrontend(vurdering.periode.fom),
            tom: formaterDatoForFrontend(vurdering.periode.tom),
          },
          vurderingerMeta: vurdering.vurderingerMeta,
          erNyVurdering: false,
          behøverVurdering: false,
          // Behold lagret status fra backend - skal IKKE regnes på nytt ved render,
          // siden tidligsteReduksjonsdato-beregningen kan endre seg (f.eks. pga. 1-månedsregel
          // basert på hva som skjer med forrige opphold i samme skjema).
          erHistoriskUtenReduksjonsberegning: vurdering.erHistoriskUtenReduksjonsberegning,
        }));
      } else if (skalJustere && vedtatteVurderingerForOpphold) {
        vurderinger = [];
      } else {
        vurderinger = [
          {
            oppholdId: opphold.oppholdId || '', // TODO Gjør om oppholdId til required i backend når ny helseinstitusjon er ute i prod
            begrunnelse: '',
            faarFriKostOgLosji: undefined,
            harFasteUtgifter: undefined,
            forsoergerEktefelle: undefined,
            periode: { fom: '', tom: oppholdAvsluttetDato },
            erNyVurdering: true,
            behøverVurdering: false,
          },
        ];
      }

      const harTidligereVurderingerOgIngenNåværendeVurderinger =
        harTidligerevurderinger && vurderingerForOpphold.length === 0 && !skalJustere;

      return {
        oppholdId: opphold.oppholdId || '',
        periode: {
          fom: formaterDatoForFrontend(opphold.oppholdFra),
          tom: oppholdAvsluttetDato,
        },
        tidligsteReduksjonsdato: opphold.tidligsteReduksjonsdato,
        vurderinger: harTidligereVurderingerOgIngenNåværendeVurderinger ? [] : vurderinger,
      };
    }),
  };
}

export function formaterDatoForFrontendMedStøtteForUendeligSlutt(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}
