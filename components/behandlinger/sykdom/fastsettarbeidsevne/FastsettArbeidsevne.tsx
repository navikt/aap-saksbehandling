'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { FormEvent } from 'react';

import { PercentIcon } from '@navikt/aksel-icons';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { validerDato } from 'lib/validation/dateValidation';

import styles from './FastsettArbeidsevne.module.css';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export type FastsettArbeidsevnePeriode = {
  arbeidsevne: string;
  enhet: 'PROSENT' | 'TIMER';
  fom: string;
  tom: string;
};

export type FastsettArbeidsevneFormFields = {
  begrunnelse: string;
  arbeidsevne: string;
  enhet: 'PROSENT' | 'TIMER';
  arbeidsevneGjelderFra: string;
};

export const FastsettArbeidsevne = ({ readOnly }: Props) => {
  // const behandlingsReferanse = useBehandlingsReferanse();
  const { form, formFields } = useConfigForm<FastsettArbeidsevneFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Vurder om innbygger har arbeidsevne',
      description: 'Hvis ikke annet er oppgitt, så antas innbygger å ha 0% arbeidsevne og rett på full ytelse',
      rules: { required: 'Du må begrunne vurderingen' },
    },
    arbeidsevne: {
      type: 'text',
      label: 'Arbeidsevne',
      rules: { required: 'Du må angi hvor stor arbeidsevne innbygger har' },
    },
    enhet: {
      type: 'select',
      label: 'Enhet',
      options: [
        { value: '', label: '-' },
        { value: 'PROSENT', label: '%' },
        { value: 'TIMER', label: 'T' },
      ],
      rules: { required: 'Du må angi en enhet for arbeidsevnen' },
    },
    arbeidsevneGjelderFra: {
      type: 'text',
      label: 'Arbeidsevne gjelder fra',
      description: 'Datoformat dd.mm.åååå',
      rules: {
        required: 'Du må angi datoen arbeidsevnen gjelder fra',
        validate: (value) => validerDato(value as string),
      },
    },
  });
  const { isLoading, status } = useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // må implementeres når backend er klar
    form.handleSubmit((data) => {
      console.log(data);
    })(event);
  };

  return (
    <VilkårsKort
      heading={'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      defaultOpen={false}
      icon={<PercentIcon />}
    >
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'FASTSETT_ARBEIDSEVNE'}
        visBekreftKnapp={!readOnly}
      >
        <FormField form={form} formField={formFields.begrunnelse} />
        <div className={styles.rad}>
          <FormField form={form} formField={formFields.arbeidsevne} />
          <FormField form={form} formField={formFields.enhet} />
        </div>
        <FormField form={form} formField={formFields.arbeidsevneGjelderFra} />
      </Form>
    </VilkårsKort>
  );
};
