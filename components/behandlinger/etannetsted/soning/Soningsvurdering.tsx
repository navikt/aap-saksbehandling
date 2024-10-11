'use client';

import { PadlockLockedIcon } from '@navikt/aksel-icons';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Soningsgrunnlag } from 'lib/types/types';
import { InstitusjonsoppholdTabell } from '../InstitusjonsoppholdTabell';
import { Behovstype, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { Form } from 'components/form/Form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { FormEvent } from 'react';
import { validerDato } from 'lib/validation/dateValidation';

interface Props {
  grunnlag: Soningsgrunnlag;
  readOnly: boolean;
  behandlingsversjon: number;
}

interface FormFields {
  begrunnelse: string;
  skalYtelsenStoppes: JaEllerNei;
  fraDato: string;
}

export const Soningsvurdering = ({ grunnlag, readOnly, behandlingsversjon }: Props) => {
  const { isLoading, status, løsBehovOgGåTilNesteSteg } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const behandlingsreferanse = useBehandlingsReferanse();
  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        defaultValue: grunnlag.soningsvurdering?.begrunnelse ?? undefined,
        label:
          'Vurder om medlemmet soner i frihet eller jobber for en arbeidsgiver utenfor anstalten, og dermed har rett på AAP under soning',
        rules: { required: 'Du må begrunne vurderingen din' },
      },
      skalYtelsenStoppes: {
        type: 'radio',
        label: 'Skal ytelsen stoppes på grunn av soning?',
        defaultValue: undefined,
        rules: { required: 'Du må ta stilling til om ytelsen skal stoppes på grunn av soning' },
        options: JaEllerNeiOptions,
      },
      fraDato: {
        label: 'Ytelsen skal opphøre fra dato',
        type: 'text',
        defaultValue: '',
        rules: {
          required: 'Når ytelsen skal stoppes må du sette hvilken dato den skal stoppes fra',
          validate: (value) => validerDato(value as string),
        },
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        // @ts-ignore TODO Legg inn korrekt vurdering når backend er klar
        behov: { behovstype: Behovstype.AVKLAR_SONINGSFORRHOLD, soningsvurdering: { begrunnelse: data.begrunnelse } },
        behandlingVersjon: behandlingsversjon,
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Soning § 11-26'} steg={'DU_ER_ET_ANNET_STED'} icon={<PadlockLockedIcon />}>
      <Form onSubmit={handleSubmit} steg={'DU_ER_ET_ANNET_STED'} status={status} isLoading={isLoading}>
        <InstitusjonsoppholdTabell
          label="Søker har følgende soningsforhold"
          beskrivelse="Under opphold i fengsel har ikke søker rett på AAP. Om man soner utenfor fengsel eller arbeider utenfor anstalt har man likevel rett på AAP"
          instutisjonsopphold={grunnlag.soningsopphold}
        />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.skalYtelsenStoppes} />
        {form.watch('skalYtelsenStoppes') === JaEllerNei.Ja && <FormField form={form} formField={formFields.fraDato} />}
      </Form>
    </VilkårsKort>
  );
};
