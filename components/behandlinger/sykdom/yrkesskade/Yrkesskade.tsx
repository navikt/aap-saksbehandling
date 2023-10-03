'use client';

import { useConfigForm } from '../../../../hooks/FormHook';
import { BehovsType, getJaNeiEllerUndefined, JaEllerNei } from '../../../../lib/utils/form';
import { stringToDate } from '../../../../lib/utils/date';
import { SykdomsGrunnlag } from '../../../../lib/types/types';
import { FormField } from '../../../input/formfield/FormField';
import { løsBehov } from '../../../../lib/api';
import { format } from 'date-fns';
import { Buldings2Icon } from '@navikt/aksel-icons';
import { VilkårsKort } from '../../../vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';

interface Props {
  behandlingsReferanse: string;
  sykdomsgrunnlag?: SykdomsGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  årssakssammenheng: string;
  dato: Date;
}

export const Yrkesskade = ({ sykdomsgrunnlag, behandlingsReferanse }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om yrkesskaden er medvirkende årsak til den nedsatte arbeidsevnen',
      description: 'Se eksempel på vilkårsvurderingstekst',
      defaultValue: sykdomsgrunnlag?.yrkesskadevurdering?.begrunnelse,
      rules: { required: 'Du må begrunne' },
    },
    årssakssammenheng: {
      type: 'radio',
      label: 'Er vilkåret (årssakssammenheng) i 11.22 oppfylt?',
      defaultValue: getJaNeiEllerUndefined(sykdomsgrunnlag?.yrkesskadevurdering?.erÅrsakssammenheng),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    dato: {
      type: 'date',
      label: 'Dato for skadetidspunkt for yrkesskaden',
      defaultValue: stringToDate(sykdomsgrunnlag?.yrkesskadevurdering?.skadetidspunkt),
      rules: {
        validate: {
          required: (value, formValues) => {
            if (!value && formValues.årssakssammenheng === JaEllerNei.Ja) {
              return 'Du må sette en dato for skadetidspunktet';
            }
          },
        },
      },
    },
  });

  return (
    <VilkårsKort heading={'Yrkesskade - årsakssammenheng § 11-22'} icon={<Buldings2Icon />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            referanse: behandlingsReferanse,
            behov: {
              // @ts-ignore
              '@type': BehovsType.YRKESSKADE,
              // @ts-ignore
              begrunnelse: data.yrkesskade_begrunnelse,
              // @ts-ignore
              dokumenterBruktIVurdering: [],
              // @ts-ignore
              erÅrsakssammenheng: data.årssakssammenheng === JaEllerNei.Ja,
              // @ts-ignore
              skadetidspunkt: format(data.dato, 'yyyy-MM-dd'),
            },
          });
        })}
        steg={'AVKLAR_YRKESSKADE'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.årssakssammenheng} />
        {form.watch('årssakssammenheng') === JaEllerNei.Ja && <FormField form={form} formField={formFields.dato} />}
      </Form>
    </VilkårsKort>
  );
};
