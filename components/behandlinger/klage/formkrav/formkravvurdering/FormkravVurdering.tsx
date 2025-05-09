'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from '../../../../../lib/utils/form';
import { useConfigForm } from '../../../../form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from '../../../../../hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from '../../../../vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField } from '../../../../form/FormField';
import { FormkravGrunnlag, TypeBehandling } from '../../../../../lib/types/types';
import { useBehandlingsReferanse } from '../../../../../hooks/BehandlingHook';

interface Props {
  grunnlag?: FormkravGrunnlag;
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  erBrukerPart: JaEllerNei;
  erFristOverholdt: JaEllerNei;
  erKonkret: JaEllerNei;
  erSignert: JaEllerNei;
  begrunnelse: string;
}

export const FormkravVurdering = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORMKRAV');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erBrukerPart: {
        type: 'radio',
        label: 'Er bruker part?',
        rules: { required: 'Du må svare på om bruker er part' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBrukerPart),
        options: JaEllerNeiOptions,
      },
      erFristOverholdt: {
        type: 'radio',
        label: 'Er fristen overholdt?',
        rules: { required: 'Du må svare på om fristen er overholdt' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erFristOverholdt),
        options: JaEllerNeiOptions,
      },
      erKonkret: {
        type: 'radio',
        label: 'Er klagen konkret?',
        rules: { required: 'Du må svare på om klagen er konkret' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erKonkret),
        options: JaEllerNeiOptions,
      },
      erSignert: {
        type: 'radio',
        label: 'Er klagen signert?',
        rules: { required: 'Du må svare på om klagen er signert' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erSignert),
        options: JaEllerNeiOptions,
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse for vurdering av formkrav',
        rules: { required: 'Du må skrive en begrunnelse' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_FORMKRAV,
          formkravVurdering: {
            erBrukerPart: data.erBrukerPart === JaEllerNei.Ja,
            erFristOverholdt: data.erFristOverholdt === JaEllerNei.Ja,
            erKonkret: data.erKonkret === JaEllerNei.Ja,
            erSignert: data.erSignert === JaEllerNei.Ja,
            begrunnelse: data.begrunnelse,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Formkrav'}
      steg={'FORMKRAV'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      erAktivtSteg={true}
    >
      <FormField form={form} formField={formFields.erBrukerPart} />
      <FormField form={form} formField={formFields.erFristOverholdt} />
      <FormField form={form} formField={formFields.erKonkret} />
      <FormField form={form} formField={formFields.erSignert} />
      <FormField form={form} formField={formFields.begrunnelse} />
    </VilkårsKortMedForm>
  );
};
