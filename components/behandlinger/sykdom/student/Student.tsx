'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Form } from 'components/form/Form';
import { Buldings2Icon } from '@navikt/aksel-icons';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { format } from 'date-fns';
import { getHeaderForSteg, mapStegTypeTilDetaljertSteg } from 'lib/utils/steg';
import { StudentGrunnlag } from 'lib/types/types';
import { stringToDate } from 'lib/utils/date';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';

interface Props {
  behandlingsreferanse: string;
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
}

interface FormFields {
  begrunnelse: string;
  oppfyller11_14: string;
  avbruttStudieDato?: Date;
}

export const Student = ({ behandlingsreferanse, behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        description: 'Begrunn vurderingen',
        label: 'Vurder... ............',
        rules: { required: 'Du må begrunne' },

        defaultValue: grunnlag?.studentvurdering?.begrunnelse,
      },
      oppfyller11_14: {
        type: 'radio',
        label: 'Har søker oppfyllt vilkårene i § 11-14?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.studentvurdering?.oppfyller11_14),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om vilkåret er oppfyllt' },
      },
      avbruttStudieDato: {
        type: 'date',
        label: 'Første dag med avbrutt studie',
        defaultValue: stringToDate(grunnlag?.studentvurdering?.avbruttStudieDato),
        rules: {
          validate: {
            required: (value, formValues) => {
              if (!value && formValues.oppfyller11_14 === JaEllerNei.Ja) {
                return 'Du må svare på når studiet ble avbrutt';
              }
            },
          },
        },
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_STUDENT_KODE,
          studentvurdering: {
            begrunnelse: data.begrunnelse,
            dokumenterBruktIVurdering: [],
            oppfyller11_14: data.oppfyller11_14 === JaEllerNei.Ja,
            avbruttStudieDato: data.avbruttStudieDato
              ? format(new Date(data.avbruttStudieDato), 'yyyy-MM-dd')
              : undefined,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort
      heading={getHeaderForSteg(mapStegTypeTilDetaljertSteg('AVKLAR_STUDENT'))}
      steg={'AVKLAR_STUDENT'}
      icon={<Buldings2Icon fontSize={'inherit'} />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />

        <FormField form={form} formField={formFields.oppfyller11_14} />

        {form.watch('oppfyller11_14') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.avbruttStudieDato} />
        )}
      </Form>
    </VilkårsKort>
  );
};
