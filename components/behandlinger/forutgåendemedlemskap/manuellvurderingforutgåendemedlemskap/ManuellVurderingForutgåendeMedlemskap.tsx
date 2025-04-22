'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { ForutgåendeMedlemskapGrunnlag } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: ForutgåendeMedlemskapGrunnlag;
  overstyring: boolean;
}

interface FormFields {
  begrunnelse: string;
  harForutgåendeMedlemskap: string;
  unntaksvilkår?: string;
}
function mapGrunnlagTilForutgående(harForutgåendeMedlemskap?: boolean | null) {
  if (harForutgåendeMedlemskap === true) {
    return JaEllerNei.Ja;
  } else if (harForutgåendeMedlemskap === false) {
    return JaEllerNei.Nei;
  }
  return undefined;
}
function mapGrunnlagTilUnntaksvilkår(
  harForutgåendeMedlemskap?: boolean | null,
  varMedlemMedNedsattArbeidsevne?: boolean | null,
  medlemMedUnntakAvMaksFemÅr?: boolean | null
) {
  if (varMedlemMedNedsattArbeidsevne === true) {
    return 'A';
  } else if (medlemMedUnntakAvMaksFemÅr === true) {
    return 'B';
  } else if (harForutgåendeMedlemskap !== undefined && harForutgåendeMedlemskap !== null) {
    return 'Nei';
  }
  return undefined;
}
export const ManuellVurderingForutgåendeMedlemskap = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { isLoading, status, resetStatus, løsBehovOgGåTilNesteSteg, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder brukerens forutgående medlemskap',
        rules: { required: 'Du må gi en begrunnelse på brukerens forutgående medlemskap' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
      harForutgåendeMedlemskap: {
        type: 'radio',
        label: 'Har brukeren fem års forutgående medlemskap i folketrygden jamfør § 11-2?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om bruker har fem års forutgående medlemskap' },
        defaultValue: mapGrunnlagTilForutgående(grunnlag?.vurdering?.harForutgåendeMedlemskap),
      },
      unntaksvilkår: {
        type: 'radio',
        label: 'Oppfyller brukeren noen av unntaksvilkårene?',
        options: [
          {
            value: 'A',
            label:
              'a: Ja, brukeren har vært medlem i forlketrygden i minst ett år umiddelbart før krav om ytelsen settes frem {{søknadsdato}}, og var medlem i trygden da arbeidsevnen ble nedsatt med minst halvparten {{beregningstidspunkt}}, og etter fylte 16 år har perioder med medlemskap som minst tilsvarer perioder uten medlemskap',
          },
          {
            value: 'B',
            label:
              'b: Ja, brukeren har vært medlem i folketrygden i minst ett år umiddelbart før krav om ytelsen settes fram {{søknadsdato}}, og har etter fylte 16 år vært medlem i folketrygden med unntak av maksimum fem år.',
          },
          { value: 'Nei', label: 'Nei' },
        ],
        rules: { required: 'Du må svare på om bruker oppfyller noen av unntaksvilkårene' },
        defaultValue: mapGrunnlagTilUnntaksvilkår(
          grunnlag?.vurdering?.harForutgåendeMedlemskap,
          grunnlag?.vurdering?.varMedlemMedNedsattArbeidsevne,
          grunnlag?.vurdering?.medlemMedUnntakAvMaksFemAar
        ),
      },
    },
    { readOnly }
  );

  const harForutgåendeMedlemskap = form.watch('harForutgåendeMedlemskap');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: overstyring
            ? Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP
            : Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP,
          manuellVurderingForForutgåendeMedlemskap: {
            begrunnelse: data.begrunnelse,
            harForutgåendeMedlemskap: data.harForutgåendeMedlemskap === JaEllerNei.Ja,
            varMedlemMedNedsattArbeidsevne: data.unntaksvilkår === 'A' ? true : null,
            medlemMedUnntakAvMaksFemAar: data.unntaksvilkår === 'B' ? true : null,
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };
  const heading = overstyring ? 'Overstyring av § 11-2 Forutgående medlemskap' : '§ 11-2 Forutgående medlemskap';
  return (
    <VilkårsKort heading={heading} steg={'VURDER_MEDLEMSKAP'}>
      <Form
        steg={'VURDER_MEDLEMSKAP'}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        status={status}
        resetStatus={resetStatus}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <FormField form={form} formField={formFields.harForutgåendeMedlemskap} horizontalRadio />
        {harForutgåendeMedlemskap === JaEllerNei.Nei && (
          <FormField form={form} formField={formFields.unntaksvilkår} className={'radio'} />
        )}
      </Form>
    </VilkårsKort>
  );
};
