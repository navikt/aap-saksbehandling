import { VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { OvergangArbeidForm } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';

type Props = {
  form: UseFormReturn<OvergangArbeidForm>;
  readOnly: boolean;
  index: number;
};

export const OvergangArbeidFormInput = ({ readOnly, index, form }: Props) => {
  const { control } = form;

  return (
    <VStack gap="5">
      <DateInputWrapper
        name={`vurderinger.${index}.fraDato`}
        label="Vurderingen gjelder fra"
        control={control}
        rules={{
          required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
          validate: (value) => validerDato(value as string),
        }}
        readOnly={readOnly}
      />

      <HvordanLeggeTilSluttdatoReadMore />

      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={control}
        label="Vilkårsvurdering"
        description="Vurder om brukeren har krav på AAP etter § 11-17"
        rules={{
          required: 'Du må gi en begrunnelse om brukeren har krav på AAP',
        }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.brukerRettPåAAP`}
        control={control}
        label="Har brukeren rett på AAP i perioden som arbeidssøker etter § 11-17?"
        horisontal={true}
        rules={{ required: 'Du må svare på om brukeren har krav på AAP i perioden som arbeidssøker etter § 11-17' }}
        readOnly={readOnly}
      />
    </VStack>
  );
};
