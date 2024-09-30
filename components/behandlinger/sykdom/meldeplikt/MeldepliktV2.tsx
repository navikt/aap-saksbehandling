'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { FigureIcon } from '@navikt/aksel-icons';
import { Form } from 'components/form/Form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { validerDato } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';

type Props = {
  behandlingVersjon: number;
  grunnlag?: FritakMeldepliktGrunnlag;
  readOnly: boolean;
};

type FritakMeldepliktFormFields = {
  begrunnelse: string;
  skalHaFritak: JaEllerNei;
  gjelderFra: string;
};

export const MeldepliktV2 = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const { form, formFields } = useConfigForm<FritakMeldepliktFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder innbyggers behov for fritak fra meldeplikt',
        rules: { required: 'Du må begrunne vurderingen din' },
        defaultValue: grunnlag?.vurderinger[0].begrunnelse,
      },
      skalHaFritak: {
        type: 'radio',
        label: 'Skal innbygger få fritak fra meldeplikt?',
        options: JaEllerNeiOptions,
        defaultValue: undefined,
        rules: { required: 'Du må svare på om innbygger skal få fritak fra meldeplikt' },
      },
      gjelderFra: {
        type: 'text',
        label: 'Vurderingen gjelder fra',
        description: 'Datoformat: dd.mm.åååå',
        defaultValue: undefined,
        rules: {
          required: 'Du må angi en dato vurderingen gjelder fra',
          validate: (value) => validerDato(value as string),
        },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('FRITAK_MELDEPLIKT');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      console.log(`Her må det skje noe... ${behandlingVersjon}:` + data);
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Unntak fra meldeplikt § 11-10 (valgfritt)'}
      steg="FRITAK_MELDEPLIKT"
      icon={<FigureIcon fontSize={'inherit'} />}
      vilkårTilhørerNavKontor
      defaultOpen={false}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FRITAK_MELDEPLIKT'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.skalHaFritak} />
        <FormField form={form} formField={formFields.gjelderFra} />
      </Form>
    </VilkårsKort>
  );
};
