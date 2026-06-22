'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { SubmitEvent, useEffect } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { DelperiodeData, ManuellInntektGrunnlag, ManuellInntektÅr, MellomlagretVurdering } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { BodyLong, BodyShort, Label, Link, VStack } from '@navikt/ds-react';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useFieldArray, useWatch } from 'react-hook-form';
import { FastsettManuellInntektTabell } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektTabell';
import { FastsettManuellInntektForm, Tabellår } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/types';
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
  sisteÅr: number;
  pgi: ManuellInntektÅr[];
  manuelleInntekter: ManuellInntektÅr[];
  delperioder: DelperiodeData[];
}

type DraftFormFields = Partial<FastsettManuellInntektForm>;

const MÅNED_KORT = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

/**
 * Bygger visningsnavn for en delperiode, f.eks. «2022 jan-feb». Måneden hentes fra ISO-datostrengen
 * uten tidssone-konvertering.
 */
const formaterDelperiodeLabel = (år: number, periodeFom: string, periodeTom: string): string => {
  const fomMåned = MÅNED_KORT[Number(periodeFom.slice(5, 7)) - 1];
  const tomMåned = MÅNED_KORT[Number(periodeTom.slice(5, 7)) - 1];
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

  const delperioder = grunnlag.delperioderForSplittÅr ?? [];
  const splittÅr = [...new Set(delperioder.map((d) => d.år))].sort((a, b) => a - b);

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapGrunnlagToDraftFormFields(grunnlag);

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
          return rad.ferdigLignetPGI === undefined && rad.beregnetPGI === undefined;
        });
        if (manglerPGI) {
          form.setError('tabellår', {
            type: 'custom',
            message: 'Du må fylle inn beregnet PGI',
          });
          return false;
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
  }, [grunnlag]);

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
                  periodeFom: år.periodeFom,
                  periodeTom: år.periodeTom,
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
    const ferdigLignet = tabellårValues?.find((rad) => rad.år === år && rad.erKunVisning)?.ferdigLignetPGI;
    if (ferdigLignet === undefined || ferdigLignet === null) {
      return false;
    }
    const sumBeregnet = (tabellårValues ?? [])
      .filter((rad) => rad.år === år && rad.erDelperiode)
      .reduce((acc, rad) => acc + Number(rad.beregnetPGI || 0), 0);
    return sumBeregnet > 0 && sumBeregnet !== ferdigLignet;
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
              ?.årsVurderinger.map((år) => ({
                år: år.år,
                ferdigLignetPGI: år.ferdigLignetPGI,
                beregnetPGI: år.beløp,
                eøsInntekt: år.eøsBeløp,
                label:
                  år.periodeFom && år.periodeTom
                    ? formaterDelperiodeLabel(år.år, år.periodeFom, år.periodeTom)
                    : undefined,
                periodeFom: år.periodeFom ?? undefined,
                periodeTom: år.periodeTom ?? undefined,
                erDelperiode: Boolean(år.periodeFom),
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
            .filter((d) => d.år === år)
            .sort((a, b) => a.periodeFom.localeCompare(b.periodeFom))
            .map((d) => (
              <BodyShort size={'small'} key={d.periodeFom}>
                {`${formaterDatoForFrontend(d.periodeFom)} - ${d.uføregrad}%`}
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
 * Sikre at inntektstabellen alltid inneholder de tre siste relevante beregningsårene.
 */
const berikMedManglendeÅr = (sisteÅr: number): Tabellår[] => {
  return [sisteÅr - 2, sisteÅr - 1, sisteÅr].map((år) => ({
    år: år,
    ferdigLignetPGI: undefined,
    beregnetPGI: undefined,
    eøsInntekt: undefined,
  }));
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

/**
 * Berik med manuelle inntekter på år-nivå dersom disse er lagt inn av saksbehandler. Periode-vurderinger
 * (endring i uføregrad) håndteres i berikMedDelperioder.
 */
const berikMedManuelleInntekter = (treÅr: Tabellår[], manuelleInntekter: ManuellInntektÅr[]): Tabellår[] => {
  return treÅr.map((år) => {
    const inntekter = manuelleInntekter.find((inntekter) => inntekter.år === år.år && !inntekter.periodeFom);
    return {
      år: år.år,
      ferdigLignetPGI: år.ferdigLignetPGI,
      beregnetPGI: inntekter?.beløp,
      eøsInntekt: inntekter?.eøsBeløp,
    };
  });
};

/**
 * For år med endring i uføregrad: gjør år-raden til en informasjonsrad og legg til én redigerbar
 * delperiode-rad per uføregrad-segment, eventuelt forhåndsutfylt med tidligere lagrede verdier.
 */
const berikMedDelperioder = (
  treÅr: Tabellår[],
  delperioder: DelperiodeData[],
  manuelleInntekter: ManuellInntektÅr[]
): Tabellår[] => {
  if (delperioder.length === 0) {
    return treÅr;
  }
  const splittÅr = new Set(delperioder.map((d) => d.år));

  return treÅr.flatMap((år) => {
    if (!splittÅr.has(år.år)) {
      return [år];
    }

    const visningsrad: Tabellår = { ...år, beregnetPGI: undefined, eøsInntekt: undefined, erKunVisning: true };

    const delperiodeRader: Tabellår[] = delperioder
      .filter((d) => d.år === år.år)
      .sort((a, b) => a.periodeFom.localeCompare(b.periodeFom))
      .map((d) => {
        const lagret = manuelleInntekter.find(
          (m) => m.år === d.år && m.periodeFom === d.periodeFom && m.periodeTom === d.periodeTom
        );
        return {
          år: år.år,
          label: formaterDelperiodeLabel(d.år, d.periodeFom, d.periodeTom),
          ferdigLignetPGI: undefined,
          beregnetPGI: lagret?.beløp,
          eøsInntekt: lagret?.eøsBeløp,
          periodeFom: d.periodeFom,
          periodeTom: d.periodeTom,
          erDelperiode: true,
        };
      });

    return [visningsrad, ...delperiodeRader];
  });
};

const byggTabellData = ({ sisteÅr, pgi, manuelleInntekter, delperioder }: ByggTabellDataProps): Tabellår[] => {
  let tabellår: Tabellår[] = [];
  tabellår = berikMedManglendeÅr(sisteÅr);
  tabellår = berikMedPGI(tabellår, pgi);
  tabellår = berikMedManuelleInntekter(tabellår, manuelleInntekter);
  tabellår = berikMedDelperioder(tabellår, delperioder, manuelleInntekter);
  return tabellår;
};

const mapGrunnlagToDraftFormFields = (grunnlag: ManuellInntektGrunnlag): DraftFormFields => {
  return {
    begrunnelse: grunnlag.manuelleVurderinger?.begrunnelse,
    tabellår: byggTabellData({
      sisteÅr: grunnlag.sisteRelevanteÅr,
      pgi: grunnlag.registrerteInntekterSisteRelevanteAr,
      manuelleInntekter: grunnlag.manuelleVurderinger?.årsVurderinger || [],
      delperioder: grunnlag.delperioderForSplittÅr ?? [],
    }),
  };
};

const emptyDraftFormFields = (): DraftFormFields => {
  return {
    begrunnelse: '',
    tabellår: [],
  };
};
