'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { Label, VStack } from '@navikt/ds-react';
import { erProsent } from 'lib/utils/validering';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { FormEvent } from 'react';
import { YrkesskadeVurderingTabell } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeVurderingTabell';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  grunnlag: YrkesskadeVurderingGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  behandlingsReferanse: string;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface YrkesskadeMedSkadeDatoFormFields {
  begrunnelse: string;
  erÅrsakssammenheng: string;
  relevanteSaker?: string[];
  relevanteYrkesskadeSaker?: YrkesskadeMedSkadeDatoSak[];
  andelAvNedsettelsen?: number;
}
export interface YrkesskadeMedSkadeDatoSak {
  ref: string;
  skadedato?: string | null;
  manuellYrkesskadeDato?: string | null;
  saksnummer?: number | null;
  erTilknyttet?: boolean;
  kilde: string;
}

type DraftFormFields = Partial<YrkesskadeMedSkadeDatoFormFields>;

export const YrkesskadeMedManuellYrkesskadeDato = ({
  grunnlag,
  behandlingVersjon,
  behandlingsReferanse,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_YRKESSKADE');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.YRKESSKADE_KODE, initialMellomlagretVurdering);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const { form, formFields } = useConfigForm<YrkesskadeMedSkadeDatoFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må begrunne' },
      },
      erÅrsakssammenheng: {
        type: 'radio',
        label: 'Finnes det en årsakssammenheng mellom yrkesskade og nedsatt arbeidsevne?',
        options: JaEllerNeiOptions,
        defaultValue: getJaNeiEllerUndefined(grunnlag.yrkesskadeVurdering?.erÅrsakssammenheng),
        rules: { required: 'Du må svare på om det finnes en årsakssammenheng' },
      },
      relevanteSaker: {
        //TODO: deprecated
        type: 'checkbox_nested',
        label: 'Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.',
        defaultValue: grunnlag.yrkesskadeVurdering?.relevanteSaker,
        rules: { required: 'Du må velge minst én yrkesskade' },
      },
      relevanteYrkesskadeSaker: {
        type: 'fieldArray',
        defaultValue: defaultValues.relevanteYrkesskadeSaker?.map((sak) => ({
          ...sak,
          manuellYrkesskadeDato: sak.manuellYrkesskadeDato ? formaterDatoForFrontend(sak.manuellYrkesskadeDato) : null,
        })),
      },
      andelAvNedsettelsen: {
        type: 'text',
        label: 'Hvor stor andel totalt av nedsatt arbeidsevne skyldes yrkesskadene?',
        defaultValue: grunnlag.yrkesskadeVurdering?.andelAvNedsettelsen?.toString(),
        rules: {
          required: 'Du må svare på hvor stor andel av den nedsatte arbeidsevnen skyldes yrkesskadene',
          validate: (value) => {
            const valueAsNumber = Number(value);
            if (isNaN(valueAsNumber)) {
              return 'Prosent må være et tall';
            } else if (!erProsent(valueAsNumber)) {
              return 'Prosent kan bare være mellom 0 og 100';
            }
          },
        },
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(
      (data) => {
        løsBehovOgGåTilNesteSteg({
          behov: {
            behovstype: Behovstype.YRKESSKADE_KODE,
            yrkesskadesvurdering: {
              begrunnelse: data.begrunnelse,
              erÅrsakssammenheng: data.erÅrsakssammenheng === JaEllerNei.Ja,
              andelAvNedsettelsen: data?.andelAvNedsettelsen,
              relevanteSaker: data.relevanteSaker || [],
              relevanteYrkesskadeSaker:
                data.relevanteYrkesskadeSaker
                  ?.filter((sak) => sak.erTilknyttet)
                  .map((s) => ({
                    referanse: s.ref,
                    manuellYrkesskadeDato: s.manuellYrkesskadeDato
                      ? formaterDatoForBackend(parse(s.manuellYrkesskadeDato, 'dd.MM.yyyy', new Date()))
                      : null,
                  })) || [],
            },
          },
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsReferanse,
        });
      },
      () => nullstillMellomlagretVurdering()
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-22 AAP ved yrkesskade'}
      steg={'VURDER_YRKESSKADE'}
      vilkårTilhørerNavKontor={false}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag.yrkesskadeVurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.yrkesskadeVurdering ? mapVurderingToDraftFormFields(grunnlag) : emptyDraftFormFields());
        });
      }}
      readOnly={readOnly}
    >
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.erÅrsakssammenheng} horizontalRadio />
      {form.watch('erÅrsakssammenheng') === JaEllerNei.Ja && (
        <>
          <VStack>
            <Label size={'small'}>
              Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.
            </Label>
            <YrkesskadeVurderingTabell form={form} readOnly={readOnly} />
          </VStack>
          <FormField form={form} formField={formFields.andelAvNedsettelsen} className={'prosent_input'} />
        </>
      )}
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(grunnlag?: YrkesskadeVurderingGrunnlag): DraftFormFields {
  return {
    begrunnelse: grunnlag?.yrkesskadeVurdering?.begrunnelse,
    erÅrsakssammenheng: getJaNeiEllerUndefined(grunnlag?.yrkesskadeVurdering?.erÅrsakssammenheng),
    relevanteSaker: grunnlag?.yrkesskadeVurdering?.relevanteSaker,
    relevanteYrkesskadeSaker: hentDefaultYrkesskadesakerFraVurderingerEllerGrunnlag(grunnlag),
    andelAvNedsettelsen: grunnlag?.yrkesskadeVurdering?.andelAvNedsettelsen ?? undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    erÅrsakssammenheng: '',
    relevanteSaker: [],
    relevanteYrkesskadeSaker: [],
    andelAvNedsettelsen: undefined,
  };
}

function hentDefaultYrkesskadesakerFraVurderingerEllerGrunnlag(
  grunnlag?: YrkesskadeVurderingGrunnlag
): YrkesskadeMedSkadeDatoSak[] {
  return (
    grunnlag?.opplysninger?.innhentedeYrkesskader?.map((skade) => {
      const alleredeTilknyttetYrkesskade = grunnlag?.yrkesskadeVurdering?.relevanteYrkesskadeSaker.find(
        (e) => e.referanse === skade.ref
      );
      return {
        ...skade,
        erTilknyttet: !!alleredeTilknyttetYrkesskade,
        manuellYrkesskadeDato: alleredeTilknyttetYrkesskade?.manuellYrkesskadeDato,
      };
    }) || []
  );
}
