'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { Buldings2Icon } from '@navikt/aksel-icons';

import { løsBehov } from 'lib/api';
import { BehovsType, JaEllerNei, getJaNeiEllerUndefined } from 'lib/utils/form';
import { format } from 'date-fns';
import { getHeaderForSteg, mapStegTypeTilDetaljertSteg } from 'lib/utils/steg';
import { StudentGrunnlag } from 'lib/types/types';
import { stringToDate } from 'lib/utils/date';

interface Props {
  behandlingsReferanse: string;
  grunnlag?: StudentGrunnlag;
}

interface FormFields {
  begrunnelse: string;
  oppfyller11_14: string;
  oppfyller7: string;
  avbruttStudieDato?: Date;
}

export const Student = ({ behandlingsReferanse, grunnlag }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      description: 'Begrunn vurderingen',
      label: 'Vurder... ............',
      rules: { required: 'Du må begrunne' },
      // TODO: Her må vi gjøre noe lurt dersom det er flere vurderinger
      defaultValue: grunnlag?.studentvurdering?.begrunnelse,
    },
    oppfyller11_14: {
      type: 'radio',
      label: 'Har søker oppfyllt vilkårene i § 11-14?',
      defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.oppfyller11_14),
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
      defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.oppfyller7),
      options: [
        { label: 'Ja', value: JaEllerNei.Ja },
        { label: 'Nei', value: JaEllerNei.Nei },
      ],
      rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
    },
    avbruttStudieDato: {
      type: 'date',
      label: 'Første dag med avbrutt studie',
      defaultValue: stringToDate(grunnlag?.studentvurdering?.avbruttStudieDato),
    },
  });

  return (
    <VilkårsKort
      heading={getHeaderForSteg(mapStegTypeTilDetaljertSteg('AVKLAR_STUDENT'))}
      steg={'AVKLAR_STUDENT'}
      icon={<Buldings2Icon fontSize={'inherit'} />}
    >
      <Form
        onSubmit={form.handleSubmit(async (data) => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              // @ts-ignore Feil generert type i backend
              '@type': BehovsType.AVKLAR_STUDENT,
              // @ts-ignore Feil generert type i backend
              studentvurdering: {
                begrunnelse: data.begrunnelse,
                dokumenterBruktIVurdering: [],
                oppfyller11_14: data.oppfyller11_14 === JaEllerNei.Ja,
                oppfyller7: data.oppfyller7 === JaEllerNei.Ja,
                avbruttStudieDato: data.avbruttStudieDato
                  ? format(new Date(data.avbruttStudieDato), 'yyyy-MM-dd')
                  : undefined,
              },
            },
            referanse: behandlingsReferanse,
          });
        })}
        steg={'AVKLAR_STUDENT'}
      >
        <FormField form={form} formField={formFields.begrunnelse} />

        <FormField form={form} formField={formFields.oppfyller11_14} />

        <FormField form={form} formField={formFields.oppfyller7} />

        <FormField form={form} formField={formFields.avbruttStudieDato} />
      </Form>
    </VilkårsKort>
  );
};
