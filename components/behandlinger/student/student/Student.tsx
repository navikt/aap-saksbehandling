'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { Buldings2Icon } from '@navikt/aksel-icons';

import { løsBehov } from 'lib/api';
import { BehovsType, JaEllerNei, getJaNeiEllerUndefined } from 'lib/utils/form';

interface Props {
  behandlingsReferanse: string;
  grunnlag?: unknown;
}

interface FormFields {
  begrunnelse: string;
  oppfyller11_14: string;
  oppfyller7: string;
  avbruttStudieDato?: Date;
}

export const Student = ({ behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      description: 'Begrunn vurderingen',
      label: 'Vurder... ............',
      rules: { required: 'Du må begrunne' },
      // TODO: Her må vi gjøre noe lurt dersom det er flere vurderinger
      defaultValue: undefined,
    },
    oppfyller11_14: {
      type: 'radio',
      label: 'Har søker oppfyllt vilkårene i § 11-14?',
      defaultValue: getJaNeiEllerUndefined(undefined),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    oppfyller7: {
      type: 'radio',
      label:
        'Har søker oppfyllt vilkårene i forskriften § 7? (behov for aktiv behandling for å komme tilbake til studiet)',
      defaultValue: getJaNeiEllerUndefined(undefined),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    avbruttStudieDato: {
      type: 'date',
      label: 'Første dag med avbrutt studie',
    },
  });

  return (
    <VilkårsKort heading={'Student - § 11-14'} icon={<Buldings2Icon fontSize={'inherit'} />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.FRITAK_MELDEPLIKT,
              // @ts-ignore Feil generert type i backend
              vurdering: {
                begrunnelse: data.begrunnelse,
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'BARNETILLEGG'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />

        <FormField form={form} formField={formFields.oppfyller11_14} />

        <FormField form={form} formField={formFields.oppfyller7} />

        <FormField form={form} formField={formFields.avbruttStudieDato} />
      </Form>
    </VilkårsKort>
  );
};
