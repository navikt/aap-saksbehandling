'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { Behovstype, getJaNeiEllerIkkeBesvart, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  HistoriskLovvalgMedlemskapVurdering,
  LovvalgEØSLand,
  LovvalgMedlemskapGrunnlag,
  MellomlagretVurdering,
} from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: LovvalgMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype;
}

interface FormFields {
  lovvalgBegrunnelse: string;
  lovvalgsLand: string;
  annetLovvalgslandMedAvtale?: string;
  medlemskapBegrunnelse?: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt?: string;
}

type DraftFormFields = Partial<FormFields>;

function maplovvalgslandTilAlpha3(lovvalgsland: string) {
  if (lovvalgsland === 'Norge') {
    return 'NOR';
  }
  return null;
}

function mapGrunnlagTilLovvalgsland(lovvalgsland?: LovvalgEØSLand) {
  if (lovvalgsland === 'NOR') {
    return 'Norge';
  } else if (lovvalgsland) {
    return 'Annet land med avtale';
  }
  return undefined;
}

function mapGrunnlagTilAnnetLovvalgslandMedAvtale(lovvalgsland?: LovvalgEØSLand) {
  if (lovvalgsland && lovvalgsland !== 'NOR') {
    return lovvalgsland;
  }
  return undefined;
}

function mapGrunnlagTilMedlemAvFolketrygdenVedSøknadstidspunkt(isMedlem?: boolean | null) {
  if (isMedlem === true) {
    return JaEllerNei.Ja;
  } else if (isMedlem === false) {
    return JaEllerNei.Nei;
  }
  return undefined;
}

export const LovvalgOgMedlemskapVedSøknadstidspunkt = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
  behovstype,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { isLoading, status, løsBehovOgGåTilNesteSteg, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_LOVVALG',
    mellomlagretVurdering
  );

  const lovvalgBegrunnelseLabel = 'Vurder riktig lovvalg ved søknadstidspunkt';
  const lovvalgsLandLabel = 'Hva er riktig lovvalgsland ved søknadstidspunkt?';
  const annetLovvalgslandMedAvtaleLabel = 'Velg land som vi vurderer som lovvalgsland';
  const medlemskapBegrunnelseLabel = 'Vurder brukerens medlemskap på søknadstidspunktet';
  const medlemAvFolkeTrygdenVedSøknadstidspunktLabel = 'Var brukeren medlem av folketrygden ved søknadstidspunktet?';

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      lovvalgBegrunnelse: {
        type: 'textarea',
        label: lovvalgBegrunnelseLabel,
        rules: { required: 'Du må gi en begrunnelse på lovvalg ved søknadstidspunkt' },
        defaultValue: defaultValues.lovvalgBegrunnelse,
      },
      lovvalgsLand: {
        type: 'radio',
        label: lovvalgsLandLabel,
        options: [
          { label: 'Norge', value: 'Norge' },
          { label: 'Annet land med avtale', value: 'Annet land med avtale' },
        ],
        rules: { required: 'Du må velge riktig lovvalg ved søknadstidspunkt' },
        defaultValue: defaultValues.lovvalgsLand,
      },
      annetLovvalgslandMedAvtale: {
        type: 'select',
        label: annetLovvalgslandMedAvtaleLabel,
        options: landMedTrygdesamarbeid,
        defaultValue: defaultValues.annetLovvalgslandMedAvtale,
      },
      medlemskapBegrunnelse: {
        type: 'textarea',
        label: medlemskapBegrunnelseLabel,
        rules: { required: 'Du må begrunne medlemskap på søknadstidspunktet' },
        defaultValue: defaultValues.medlemskapBegrunnelse,
      },
      medlemAvFolkeTrygdenVedSøknadstidspunkt: {
        type: 'radio',
        label: medlemAvFolkeTrygdenVedSøknadstidspunktLabel,
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om brukeren var medlem av folketrygden på søknadstidspunkt' },
        defaultValue: defaultValues.medlemAvFolkeTrygdenVedSøknadstidspunkt,
      },
    },
    { readOnly: formReadOnly }
  );

  const lovvalgsLand = form.watch('lovvalgsLand');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: behovstype,
            manuellVurderingForLovvalgMedlemskap: {
              lovvalgVedSøknadsTidspunkt: {
                begrunnelse: data.lovvalgBegrunnelse,
                lovvalgsEØSLand:
                  data.lovvalgsLand === 'Annet land med avtale'
                    ? (data.annetLovvalgslandMedAvtale as LovvalgEØSLand)
                    : maplovvalgslandTilAlpha3(data.lovvalgsLand),
              },
              medlemskapVedSøknadsTidspunkt:
                data.lovvalgsLand === 'Annet land med avtale'
                  ? undefined
                  : {
                      begrunnelse: data.medlemskapBegrunnelse,
                      varMedlemIFolketrygd: data.medlemAvFolkeTrygdenVedSøknadstidspunkt === JaEllerNei.Ja,
                    },
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };
  const heading = overstyring
    ? 'Overstyring av lovvalg og medlemskap ved søknadstidspunkt'
    : 'Lovvalg og medlemskap ved søknadstidspunkt';

  const historiskeManuelleVurderinger = grunnlag?.historiskeManuelleVurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={heading}
      steg={'VURDER_LOVVALG'}
      onSubmit={handleSubmit}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring({ ...form.watch(), overstyring })}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
        });
      }}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      {historiskeManuelleVurderinger && historiskeManuelleVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeManuelleVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => v.erGjeldendeVurdering}
          getFomDato={(v) => v.vurdertDato}
          getVurdertAvIdent={(v) => v.vurdertAvIdent}
          getVurdertDato={(v) => v.vurdertDato}
        />
      )}

      <FormField form={form} formField={formFields.lovvalgBegrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.lovvalgsLand} />
      {lovvalgsLand === 'Annet land med avtale' && (
        <FormField form={form} formField={formFields.annetLovvalgslandMedAvtale} />
      )}
      {lovvalgsLand === 'Norge' && (
        <>
          <FormField form={form} formField={formFields.medlemskapBegrunnelse} className={'begrunnelse'} />
          <FormField form={form} formField={formFields.medlemAvFolkeTrygdenVedSøknadstidspunkt} horizontalRadio />
        </>
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );

  function mapVurderingToDraftFormFields(vurdering?: LovvalgMedlemskapGrunnlag['vurdering']): DraftFormFields {
    return {
      lovvalgBegrunnelse: vurdering?.lovvalgVedSøknadsTidspunkt.begrunnelse,
      lovvalgsLand: mapGrunnlagTilLovvalgsland(vurdering?.lovvalgVedSøknadsTidspunkt.lovvalgsEØSLand),
      annetLovvalgslandMedAvtale: mapGrunnlagTilAnnetLovvalgslandMedAvtale(
        vurdering?.lovvalgVedSøknadsTidspunkt?.lovvalgsEØSLand
      ),
      medlemskapBegrunnelse: grunnlag?.vurdering?.medlemskapVedSøknadsTidspunkt?.begrunnelse
        ? grunnlag.vurdering?.medlemskapVedSøknadsTidspunkt?.begrunnelse
        : undefined,
      medlemAvFolkeTrygdenVedSøknadstidspunkt: mapGrunnlagTilMedlemAvFolketrygdenVedSøknadstidspunkt(
        grunnlag?.vurdering?.medlemskapVedSøknadsTidspunkt?.varMedlemIFolketrygd
      ),
    };
  }

  function emptyDraftFormFields(): DraftFormFields {
    return {
      lovvalgBegrunnelse: '',
      medlemAvFolkeTrygdenVedSøknadstidspunkt: '',
      medlemskapBegrunnelse: '',
      lovvalgsLand: '',
      annetLovvalgslandMedAvtale: '',
    };
  }

  function byggFelter(vurdering: HistoriskLovvalgMedlemskapVurdering): ValuePair[] {
    return [
      {
        label: lovvalgBegrunnelseLabel,
        value: vurdering.vurdering.lovvalgVedSøknadsTidspunkt.begrunnelse || '',
      },
      {
        label: lovvalgsLandLabel,
        value: vurdering.vurdering.lovvalgVedSøknadsTidspunkt.lovvalgsEØSLand || '',
      },
      {
        label: medlemskapBegrunnelseLabel,
        value: vurdering.vurdering.medlemskapVedSøknadsTidspunkt?.begrunnelse || '',
      },
      {
        label: medlemAvFolkeTrygdenVedSøknadstidspunktLabel,
        value: getJaNeiEllerIkkeBesvart(vurdering.vurdering.medlemskapVedSøknadsTidspunkt?.varMedlemIFolketrygd),
      },
    ];
  }
};
