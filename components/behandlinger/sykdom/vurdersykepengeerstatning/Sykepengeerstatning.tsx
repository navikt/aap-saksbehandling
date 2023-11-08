'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FigureIcon } from '@navikt/aksel-icons';
import { useConfigForm } from 'hooks/FormHook';
import { BehovsType, JaEllerNei } from 'lib/utils/form';
import { Form } from 'components/form/Form';
import { FormField } from 'components/input/formfield/FormField';
import { løsBehov } from 'lib/api';

interface Props {
  behandlingsReferanse: string;
}

interface FormFields {
  begrunnelse: string;
  erOppfylt: string;
  grunn: string[];
}

export const Sykepengeerstatning = ({ behandlingsReferanse }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder om søker har rett til sykepengeerstatning',
        rules: { required: 'Du må begrunne avgjørelsen din.' },
      },
      erOppfylt: {
        type: 'radio',
        label: 'Krav på sykepengeerstatning?',
        rules: { required: 'Du må ta stilling til om søkeren har rett på AAP som sykepengeerstatning.' },
        options: [
          { label: 'Ja', value: JaEllerNei.Ja },
          { label: 'Nei', value: JaEllerNei.Nei },
        ],
      },
      grunn: {
        type: 'checkbox',
        label: 'Velg minst en grunn',
        rules: { required: 'Du må velge minst en grunn' },
        options: [
          'Medlemmet har tidligere mottatt arbeidsavklaringspenger og innen seks måneder etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av en annen sykdom',
          'Medlemmet har tidligere mottatt arbeidsavklaringspenger og innen ett år etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av samme sykdom',
          'Medlemmet har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og igjen blir arbeidsufør på grunn av sykdom eller skade mens han eller hun er i arbeid',
          'Medlemmet har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og fortsatt er arbeidsufør på grunn av sykdom eller skade',
          'Medlemmet har mottatt arbeidsavklaringspenger og deretter foreldrepenger og innen seks måneder etter foreldrepengene opphørte, blir arbeidsufør på grunn av sykdom eller skade, se § 8-2 andre ledd',
        ],
      },
    },
    { shouldUnregister: true }
  );

  return (
    <VilkårsKort heading={'Sykepengeerstatning § 11-13'} steg="VURDER_SYKEPENGEERSTATNING" icon={<FigureIcon />}>
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.SYKEPENGEERSTATNING,
              // @ts-ignore Feil generert type i backend
              vurdering: {
                begrunnelse: data.begrunnelse,
                dokumenterBruktIVurdering: [],
                harRettPå: data.erOppfylt === JaEllerNei.Ja,
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'VURDER_SYKEPENGEERSTATNING'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.erOppfylt} />
        {form.watch('erOppfylt') === JaEllerNei.Ja && <FormField form={form} formField={formFields.grunn} />}
      </Form>
    </VilkårsKort>
  );
};
