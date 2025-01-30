'use client'

import {VilkårsKort} from "components/vilkårskort/VilkårsKort";
import {JaEllerNei, JaEllerNeiOptions} from "lib/utils/form";
import {FormField, useConfigForm} from "@navikt/aap-felles-react";
import {useLøsBehovOgGåTilNesteSteg} from "hooks/LøsBehovOgGåTilNesteStegHook";
import {Form} from "components/form/Form";

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: unknown;
}
interface FormFields {
  begrunnelse: string;
  medlemAvFolkeTrygdenVedSøknadstidspunkt: JaEllerNei;
}
export const MedlemskapVedSøknadstidspunkt = ({readOnly}: Props) => {
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('VURDER_MEDLEMSKAP');
  const {form, formFields} = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder brukerens medlemskap på søknadstidspunktet',
      rules: {required: 'Du må begrunne medlemskap på søknadstidspunktet'},
    },
    medlemAvFolkeTrygdenVedSøknadstidspunkt: {
      type: 'radio',
      label: 'Var brukeren medlem av folketrygden ved søknadstidspunktet?',
      options: JaEllerNeiOptions,
      rules: {required: 'Du må velg om brukeren var medlem av folketrygden på søknadstidspunkt'},
    }
  }, {readOnly});
  return (
    <VilkårsKort heading={'Medlemskap ved søknadstidspunkt'} steg={'VURDER_MEDLEMSKAP'}>
      <Form steg={'VURDER_MEDLEMSKAP'} onSubmit={form.handleSubmit(data => console.log(data))} isLoading={isLoading} status={status}>
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.medlemAvFolkeTrygdenVedSøknadstidspunkt} />
      </Form>
    </VilkårsKort>
  )
}