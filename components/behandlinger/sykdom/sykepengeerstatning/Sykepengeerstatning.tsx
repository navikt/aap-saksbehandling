'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FigureIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'hooks/FormHook';
import { getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';

interface Props {
  behandlingsReferanse: string;
}

// TODO API og skisser er ikke helt i harmoni
interface FormFields {
  begrunnelse: string;
  harRettPå?: string | undefined;
}

export const Sykepengeerstatning = ({ behandlingsReferanse }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'text',
      label: 'Vurder om søker har rett til sykepengeerstatning',
      defaultValue: '',
      rules: { required: 'Du må begrunne avgjørelsen din.' },
    },
    harRettPå: {
      type: 'radio',
      label: 'LABEL-TODO',
      defaultValue: getJaNeiEllerUndefined(undefined),
      rules: { required: 'Du må ta stilling til om søkeren har rett på AAP som sykepengeerstatning.' },
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
    },
  });
  return (
    <VilkårsKort heading={'Sykepengeerstatning § 11-13'} steg="VURDER_SYKEPENGEERSTATNING" icon={<FigureIcon />}>
      <Form
        onSubmit={() => {
          console.warn(`TODO, post løsning for ${behandlingsReferanse}`);
        }}
        steg={'VURDER_SYKEPENGEERSTATNING'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
      </Form>
    </VilkårsKort>
  );
};
