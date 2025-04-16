'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { Behovstype, getJaNeiEllerIkkeBesvart, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { LovvalgEØSLand, LovvalgMedlemskapGrunnlag } from 'lib/types/types';
import { TidligereVurderingerV2 } from 'components/tidligerevurderinger/TidligereVurderingerV2';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: LovvalgMedlemskapGrunnlag;
  overstyring: boolean;
}

interface FormFields {
  lovvalgBegrunnelse: string;
  lovvalgsLand: string;
  annetLovvalgslandMedAvtale?: string;
  medlemskapBegrunnelse?: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt?: JaEllerNei;
}
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
export const LovvalgOgMedlemskapVedSKnadstidspunkt = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { isLoading, status, løsBehovOgGåTilNesteSteg, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      lovvalgBegrunnelse: {
        type: 'textarea',
        label: 'Vurder riktig lovvalg ved søknadstidspunkt',
        rules: { required: 'Du må gi en begrunnelse på lovvalg ved søknadstidspunkt' },
        defaultValue: grunnlag?.vurdering?.lovvalgVedSøknadsTidspunkt?.begrunnelse,
      },
      lovvalgsLand: {
        type: 'radio',
        label: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
        options: [
          { label: 'Norge', value: 'Norge' },
          { label: 'Annet land med avtale', value: 'Annet land med avtale' },
        ],
        rules: { required: 'Du må velge riktig lovvalg ved søknadstidspunkt' },
        defaultValue: mapGrunnlagTilLovvalgsland(grunnlag?.vurdering?.lovvalgVedSøknadsTidspunkt?.lovvalgsEØSLand),
      },
      annetLovvalgslandMedAvtale: {
        type: 'select',
        label: 'Velg land som vi vurderer som lovvalgsland',
        options: landMedTrygdesamarbeid,
        defaultValue: mapGrunnlagTilAnnetLovvalgslandMedAvtale(
          grunnlag?.vurdering?.lovvalgVedSøknadsTidspunkt?.lovvalgsEØSLand
        ),
      },
      medlemskapBegrunnelse: {
        type: 'textarea',
        label: 'Vurder brukerens medlemskap på søknadstidspunktet',
        rules: { required: 'Du må begrunne medlemskap på søknadstidspunktet' },
        defaultValue: grunnlag?.vurdering?.medlemskapVedSøknadsTidspunkt?.begrunnelse
          ? grunnlag.vurdering?.medlemskapVedSøknadsTidspunkt?.begrunnelse
          : undefined,
      },
      medlemAvFolkeTrygdenVedSøknadstidspunkt: {
        type: 'radio',
        label: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velg om brukeren var medlem av folketrygden på søknadstidspunkt' },
        defaultValue: mapGrunnlagTilMedlemAvFolketrygdenVedSøknadstidspunkt(
          grunnlag?.vurdering?.medlemskapVedSøknadsTidspunkt?.varMedlemIFolketrygd
        ),
      },
    },
    { readOnly }
  );

  const lovvalgsLand = form.watch('lovvalgsLand');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: overstyring ? Behovstype.MANUELL_OVERSTYRING_LOVVALG : Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
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
      });
    })(event);
  };
  const heading = overstyring
    ? 'Overstyring av lovvalg og medlemskap ved søknadstidspunkt'
    : 'Lovvalg og medlemskap ved søknadstidspunkt';

  const historiskeManuelleVurderinger = grunnlag?.historiskeManuelleVurderinger;

  return (
    <VilkårsKort heading={heading} steg={'VURDER_LOVVALG'}>
      {historiskeManuelleVurderinger && historiskeManuelleVurderinger.length > 0 && (
        <TidligereVurderingerV2
          tidligereVurderinger={historiskeManuelleVurderinger.map((vurdering) => ({
            ...vurdering,
            felter: [
              {
                label: 'Vurder riktig lovvalg ved søknadstidspunkt',
                value: vurdering.vurdering.lovvalgVedSøknadsTidspunkt.begrunnelse || '',
              },
              {
                label: 'Hva er riktig lovvalgsland ved søknadstidspunkt?',
                value: vurdering.vurdering.lovvalgVedSøknadsTidspunkt.lovvalgsEØSLand || '',
              },
              {
                label: 'Vurder brukerens medlemskap på søknadstidspunktet',
                value: vurdering.vurdering.medlemskapVedSøknadsTidspunkt?.begrunnelse || '',
              },
              {
                label: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
                value: getJaNeiEllerIkkeBesvart(
                  vurdering.vurdering.medlemskapVedSøknadsTidspunkt?.varMedlemIFolketrygd
                ),
              },
            ],
          }))}
        />
      )}
      <Form
        steg={'VURDER_LOVVALG'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        status={status}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      >
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
      </Form>
    </VilkårsKort>
  );
};
