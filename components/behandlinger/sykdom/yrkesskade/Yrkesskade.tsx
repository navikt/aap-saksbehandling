'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { MellomlagretVurdering, YrkesskadeVurderingGrunnlag } from 'lib/types/types';
import { Label, VStack } from '@navikt/ds-react';
import { erProsent } from 'lib/utils/validering';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { FormEvent, useEffect } from 'react';
import { YrkesskadeVurderingTabell } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeVurderingTabell';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { useFieldArray } from 'react-hook-form';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

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

export const Yrkesskade = ({
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

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_YRKESSKADE',
    mellomlagretVurdering
  );

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
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const { fields: relevanteYrkesskadeSaker, update } = useFieldArray({
    name: 'relevanteYrkesskadeSaker',
    control: form.control,
    rules: {
      validate: (fields) => {
        // skip validering hvis erÅrsaksammenheng er Nei. Da skulle egentlig denne vært unmounted
        const erÅrsakssammenheng = form.getValues('erÅrsakssammenheng');
        if (erÅrsakssammenheng === JaEllerNei.Nei) {
          return;
        }
        const ingenYrkesskadeErTilknyttet = fields.every((yrkesskade) => !yrkesskade.erTilknyttet);
        if (ingenYrkesskadeErTilknyttet) {
          form.setError('relevanteYrkesskadeSaker', {
            type: 'custom',
            message: 'Du må velge minst én yrkesskade',
          });
          return false;
        }
      },
    },
  });

  const erÅrsakssammenheng = form.watch('erÅrsakssammenheng');
  useEffect(() => {
    if (erÅrsakssammenheng === JaEllerNei.Nei) {
      form.setValue(
        'relevanteYrkesskadeSaker',
        relevanteYrkesskadeSaker.map((sak) => ({ ...sak, erTilknyttet: false }))
      );
    }
  }, [erÅrsakssammenheng]);

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
    <VilkårskortMedFormOgMellomlagringNyVisning
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
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.erÅrsakssammenheng} horizontalRadio />
      {erÅrsakssammenheng === JaEllerNei.Ja && (
        <>
          <VStack>
            <Label size={'small'}>
              Tilknytt eventuelle yrkesskader som er helt eller delvis årsak til den nedsatte arbeidsevnen.
            </Label>
            <YrkesskadeVurderingTabell
              form={form}
              readOnly={formReadOnly}
              yrkesskader={relevanteYrkesskadeSaker}
              update={update}
            />
          </VStack>
          <FormField form={form} formField={formFields.andelAvNedsettelsen} className={'prosent_input'} />
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
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
