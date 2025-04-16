'use client';

import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormEvent } from 'react';
import { Behovstype } from 'lib/utils/form';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Form } from 'components/form/Form';
import { validerDato } from '../../../lib/validation/dateValidation';
import { formaterDatoForBackend, formaterDatoForFrontend } from '../../../lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  readOnly: boolean;
  behandlingVersjon: number;
  grunnlag: any;
}

interface FormFields {
  begrunnelse: string;
  startDato: string;
}

export const VurderRettighetsperiode = ({ grunnlag, readOnly, behandlingVersjon }: Props) => {
  console.log(grunnlag);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, resetStatus, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_RETTIGHETSPERIODE');
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        rules: { required: 'Du må begrunne hvorfor starttidspunktet for saken skal endres' },
        defaultValue: grunnlag.begrunnelse || '',
      },
      startDato: {
        type: 'date_input',
        label: 'Sett ny startdato for saken',
        rules: {
          required: 'Du må sette en dato for behandlingen',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
          },
        },
        defaultValue: (grunnlag.startDato && formaterDatoForFrontend(grunnlag.startDato)) || undefined,
      },
    },
    { readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_RETTIGHETSPERIODE,
          rettighetsperiodeVurdering: {
            begrunnelse: data.begrunnelse,
            startDato: formaterDatoForBackend(parse(data.startDato, 'dd.MM.yyyy', new Date())),
          },
        },
        referanse: behandlingsReferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Starttidspunkt'} steg={'VURDER_RETTIGHETSPERIODE'}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        resetStatus={resetStatus}
        isLoading={isLoading}
        steg={'VURDER_RETTIGHETSPERIODE'}
        visBekreftKnapp={!readOnly}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      >
        <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
        <FormField form={form} formField={formFields.startDato} />
      </Form>
    </VilkårsKort>
  );
};
