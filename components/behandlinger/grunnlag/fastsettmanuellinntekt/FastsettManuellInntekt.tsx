'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { SubmitEvent, useEffect, useMemo } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { DelperiodeData, ManuellInntektGrunnlag, ManuellInntektÅr, MellomlagretVurdering } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { BodyLong, BodyShort, Label, Link, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useFieldArray, useWatch } from 'react-hook-form';
import { FastsettManuellInntektTabell } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektTabell';
import { FastsettManuellInntektForm, Tabellår } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/types';
import { Dato } from 'lib/types/Dato';
import { sorterEtterNyesteDato, formaterDatoForFrontend } from 'lib/utils/date';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami';
import { Alert } from 'components/alert/Alert';

interface Props {
  behandlingsversjon: number;
  grunnlag: ManuellInntektGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behandlingErRevurdering: boolean;
}

interface ByggTabellDataProps {
  relevanteÅr: number[];
  pgi: ManuellInntektÅr[];
  manuelleInntekter: ManuellInntektÅr[];
  delperioder: DelperiodeData[];
}

type DraftFormFields = Partial<FastsettManuellInntektForm>;

const formaterMåned = (dato: string): string => format(new Dato(dato).dato, 'LLL', { locale: nb });
const utledÅrFraPeriodeFom = (periodeFom: string): number => new Dato(periodeFom).dato.getFullYear();

const formaterDelperiodeLabel = (år: number, periodeFom: string, periodeTom: string): string => {
  const fomMåned = formaterMåned(periodeFom);
  const tomMåned = formaterMåned(periodeTom);
  return `${år} ${fomMåned}-${tomMåned}`;
};

export const FastsettManuellInntekt = ({
  behandlingsversjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
  behandlingErRevurdering,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('MANGLENDE_LIGNING');

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'MANGLENDE_LIGNING',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const delperioder = grunnlag.manglendeMånedsInntekter ?? [];
  const splittÅr = [...new Set(delperioder.map((delPeriode) => utledÅrFraPeriodeFom(delPeriode.periode.fom)))].sort(
    (a, b) => a - b
  );

  const defaultValue: DraftFormFields = useMemo(
    () =>
      initialMellomlagretVurdering
        ? JSON.parse(initialMellomlagretVurdering.data)
        : mapGrunnlagToDraftFormFields(grunnlag),
    [grunnlag, initialMellomlagretVurdering]
  );

  const { form, formFields } = useConfigForm<FastsettManuellInntektForm>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse for endret arbeidsinntekt',
        rules: { required: 'Du må gi en begrunnelse.' },
        defaultValue: defaultValue.begrunnelse,
      },
      tabellår: {
        type: 'fieldArray',
        label: 'Hvilke år skal inntekt overstyres?',
        defaultValue: defaultValue.tabellår,
      },
    },
    { readOnly: formReadOnly }
  );

  const { fields: tabellår } = useFieldArray({
    name: 'tabellår',
    control: form.control,
    rules: {
      validate: (år) => {
        const manglerPGI = år.some((rad) => {
          if (rad.erKunVisning) {
            return false;
          }
          return (
            rad.ferdigLignetPGI === undefined &&
            rad.beregnetPGI === undefined &&
            grunnlag.manglerInntektForÅr.includes(rad.år)
          );
        });
        if (manglerPGI) {
          return 'Du må fylle inn beregnet PGI';
        }
      },
    },
  });

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.FASTSETT_MANUELL_INNTEKT,
    initialMellomlagretVurdering,
    form
  );

  /**
   * Sikre at tabellår oppdateres dersom grunnlag endres (ved oppdatering av dato for nedsatt arbeidsevne).
   */
  useEffect(() => {
    form.setValue('tabellår', defaultValue.tabellår || []);
  }, [grunnlag, defaultValue.tabellår, form]);

  function handleSubmit(event: SubmitEvent) {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingsversjon,
          behov: {
            behovstype: Behovstype.FASTSETT_MANUELL_INNTEKT,
            manuellVurderingForManglendeInntekt: {
              begrunnelse: data.begrunnelse,
              vurderinger: data.tabellår
                .filter((år) => !år.erKunVisning)
                .map((år) => ({
                  år: år.år,
                  beløp: Number(år.beregnetPGI),
                  eøsBeløp: Number(år.eøsInntekt),
                  ferdigLignetPGI: år.ferdigLignetPGI ?? undefined,
                  periode:
                    år.periodeFom && år.periodeTom
                      ? {
                          fom: år.periodeFom,
                          tom: år.periodeTom,
                        }
                      : undefined,
                })),
            },
          },
          referanse: behandlingsreferanse,
        },
        () => {
          loggUmamiVarighet('STEG_MANGLENDE_LIGNING_VARIGHET', umamiStartTidspunkt, Date.now());
          visningActions.onBekreftClick();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  }

  const visHovedinnhold = !formReadOnly || grunnlag.manuelleVurderinger !== null;
  const vurderinger = grunnlag.historiskeManuelleVurderinger?.sort((a, b) => {
    return sorterEtterNyesteDato(a.vurderingerMeta.vurdertAv?.dato ?? '', b.vurderingerMeta.vurdertAv?.dato ?? '');
  });

  const tabellårValues = useWatch({ control: form.control, name: 'tabellår' });
  const harAvvikMotFerdigLignet = splittÅr.some((år) => {
    const ferdigLignetPgiForÅr = tabellårValues?.find((rad) => rad.år === år && rad.erKunVisning)?.ferdigLignetPGI;
    if (ferdigLignetPgiForÅr === undefined || ferdigLignetPgiForÅr === null) {
      return false;
    }
    const sumBeregnet = (tabellårValues ?? [])
      .filter((rad) => rad.år === år && rad.erDelperiode)
      .reduce((acc, rad) => acc + Number(rad.beregnetPGI || 0), 0);
    return sumBeregnet > 0 && sumBeregnet !== ferdigLignetPgiForÅr;
  });

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'Manglende pensjonsgivende inntekt / EØS-beregnet inntekt'}
      steg={'MANGLENDE_LIGNING'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      vilkårTilhørerNavKontor={false}
      vurderingerMeta={grunnlag.manuelleVurderinger?.vurderingerMeta}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag ? mapGrunnlagToDraftFormFields(grunnlag) : emptyDraftFormFields());
        });
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {behandlingErRevurdering && vurderinger && (
        <TidligereVurderinger
          data={vurderinger}
          getErGjeldende={(v) => deepEqual(v, vurderinger.at(0))}
          getVurdertAvIdent={(v) => v.vurderingerMeta.vurdertAv?.ident ?? ''}
          getVurdertDato={(v) => v.vurderingerMeta.vurdertAv?.dato ?? ''}
          getFomDato={(v) => v.vurderingerMeta.vurdertAv?.dato}
          grupperPåOpprettetDato={true}
          customElement={(valgtVurderingIndex) => {
            const tabelldata: Tabellår[] | undefined = vurderinger
              .at(valgtVurderingIndex)
              ?.årsVurderinger.map((årsVurdering) => ({
                år: årsVurdering.år,
                ferdigLignetPGI: årsVurdering.ferdigLignetPGI,
                beregnetPGI: årsVurdering.beløp,
                eøsInntekt: årsVurdering.eøsBeløp,
                label:
                  årsVurdering.periode?.fom && årsVurdering.periode?.tom
                    ? formaterDelperiodeLabel(årsVurdering.år, årsVurdering.periode.fom, årsVurdering.periode.tom)
                    : undefined,
                periodeFom: årsVurdering.periode?.fom ?? undefined,
                periodeTom: årsVurdering.periode?.tom ?? undefined,
                erDelperiode: Boolean(årsVurdering.periode),
              }));

            return (
              <>
                <VStack>
                  <Label size="small">{formFields.begrunnelse.label}</Label>
                  <BodyShort size="small">{vurderinger.at(valgtVurderingIndex)?.begrunnelse}</BodyShort>
                </VStack>
                <VStack>
                  {tabelldata && <FastsettManuellInntektTabell form={form} tabellår={tabelldata} låstVisning={true} />}
                </VStack>
              </>
            );
          }}
        />
      )}
      {grunnlag.registrerteInntekterSisteRelevanteAr.length < 3 && (
        <Alert variant={'warning'}>
          Du må oppgi pensjonsgivende inntekt for år hvor inntekten ikke er ferdig lignet.
        </Alert>
      )}
      {splittÅr.map((år) => (
        <Alert variant={'warning'} key={`ufore-${år}`}>
          <BodyShort spacing>
            {`Brukeren har hatt endring i uføregrad i løpet av ${år}. Det mangler inntekter i A-inntekt for perioden. Du må legge inn inntekter manuelt for perioden før og etter endring av uføregrad i ${år} for å sikre korrekt beregningsgrunnlag.`}
          </BodyShort>
          <Label size={'small'}>Uføregrad</Label>
          {delperioder
            .filter((d) => utledÅrFraPeriodeFom(d.periode.fom) === år)
            .sort((a, b) => a.periode.fom.localeCompare(b.periode.fom))
            .map((d) => (
              <BodyShort size={'small'} key={d.periode.fom}>
                {`${formaterDatoForFrontend(d.periode.fom)} - ${d.uføregrad}%`}
              </BodyShort>
            ))}
        </Alert>
      ))}
      <BodyShort>
        Hvis det mangler pensjonsgivende inntekt for noen av beregningsårene, eller brukerens inntekt skal beregnes med
        utgangspunkt i arbeidsperioder i EØS, så kan brukerens inntekt overstyres. Inntekter skal ikke oppjusteres etter
        G, da det gjøres automatisk av systemet.
      </BodyShort>
      {visHovedinnhold && (
        <>
          <BodyLong size={'small'}>
            <Link
              href="https://lovdata.no/pro/rundskriv/r45-00/KAPITTEL_10-7-3'"
              target="_blank"
              rel="noopener noreferrer"
            >
              Du kan lese mer om hvordan EØS-inntekt skal beregnes i kapittel 11.7 av EØS-rundskrivet.
            </Link>
          </BodyLong>
          <FormField form={form} formField={formFields.begrunnelse} />
          <FastsettManuellInntektTabell form={form} tabellår={tabellår} readOnly={formReadOnly} />
          {harAvvikMotFerdigLignet && (
            <Alert variant={'warning'}>
              Beregnet pensjonsgivende inntekt avviker fra ferdig lignet pensjonsgivende inntekt. Er du sikker på at
              beregnet inntekt er riktig?
            </Alert>
          )}
        </>
      )}
    </VilkårskortMedFormOgMellomlagring>
  );
};

/**
 * Sikre at inntektstabellen alltid inneholder de relevante beregningsårene.
 */
const berikMedManglendeÅr = (relevantÅr: number): Tabellår => {
  return {
    år: relevantÅr,
    ferdigLignetPGI: undefined,
    beregnetPGI: undefined,
    eøsInntekt: undefined,
  };
};

/**
 * Berik siste tre relevante beregningsår med pensjonsgivende inntekter fra grunnlag dersom de finnes.
 */
const berikMedPGI = (treÅr: Tabellår[], pgi: ManuellInntektÅr[]): Tabellår[] => {
  return treÅr.map((år) => {
    const inntekter = pgi.find((inntekter) => inntekter.år === år.år);
    return {
      år: år.år,
      ferdigLignetPGI: inntekter?.beløp,
      beregnetPGI: undefined,
      eøsInntekt: undefined,
    };
  });
};

const berikMedManuelleInntekter = (treÅr: Tabellår[], manuelleInntekter: ManuellInntektÅr[]): Tabellår[] => {
  return treÅr.map((tabellÅr) => {
    const inntekter = manuelleInntekter.find((inntekter) => inntekter.år === tabellÅr.år && !inntekter.periode);
    return {
      år: tabellÅr.år,
      ferdigLignetPGI: tabellÅr.ferdigLignetPGI,
      beregnetPGI: inntekter?.beløp,
      eøsInntekt: inntekter?.eøsBeløp,
    };
  });
};

const berikMedDelperioder = (
  treÅr: Tabellår[],
  delperioder: DelperiodeData[],
  manuelleInntekter: ManuellInntektÅr[]
): Tabellår[] => {
  if (delperioder.length === 0) {
    return treÅr;
  }
  const splittÅr = new Set(delperioder.map((d) => utledÅrFraPeriodeFom(d.periode.fom)));

  return treÅr.flatMap((tabellÅr) => {
    if (!splittÅr.has(tabellÅr.år)) {
      return [tabellÅr];
    }

    const visningsrad: Tabellår = { ...tabellÅr, beregnetPGI: undefined, eøsInntekt: undefined, erKunVisning: true };

    const delperiodeRader: Tabellår[] = delperioder
      .filter((d) => utledÅrFraPeriodeFom(d.periode.fom) === tabellÅr.år)
      .sort((a, b) => a.periode.fom.localeCompare(b.periode.fom))
      .map((d) => {
        const lagret = manuelleInntekter.find(
          (m) => m.år === tabellÅr.år && m.periode?.fom === d.periode.fom && m.periode?.tom === d.periode.tom
        );
        return {
          år: tabellÅr.år,
          label: formaterDelperiodeLabel(tabellÅr.år, d.periode.fom, d.periode.tom),
          ferdigLignetPGI: undefined,
          beregnetPGI: lagret?.beløp,
          eøsInntekt: lagret?.eøsBeløp,
          periodeFom: d.periode.fom,
          periodeTom: d.periode.tom,
          erDelperiode: true,
        };
      });

    return [visningsrad, ...delperiodeRader];
  });
};

const byggTabellData = ({ relevanteÅr, pgi, manuelleInntekter, delperioder }: ByggTabellDataProps): Tabellår[] => {
  let tabellår: Tabellår[] = [];
  tabellår = relevanteÅr.map((år) => berikMedManglendeÅr(år));
  tabellår = berikMedPGI(tabellår, pgi);
  tabellår = berikMedManuelleInntekter(tabellår, manuelleInntekter);
  tabellår = berikMedDelperioder(tabellår, delperioder, manuelleInntekter);
  return tabellår;
};

const mapGrunnlagToDraftFormFields = (grunnlag: ManuellInntektGrunnlag): DraftFormFields => {
  return {
    begrunnelse: grunnlag.manuelleVurderinger?.begrunnelse,
    tabellår: byggTabellData({
      relevanteÅr: grunnlag.alleRelevanteÅr,
      pgi: grunnlag.registrerteInntekterSisteRelevanteAr,
      manuelleInntekter: grunnlag.manuelleVurderinger?.årsVurderinger || [],
      delperioder: grunnlag.manglendeMånedsInntekter ?? [],
    }),
  };
};

const emptyDraftFormFields = (): DraftFormFields => {
  return {
    begrunnelse: '',
    tabellår: [],
  };
};
