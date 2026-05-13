import { HStack, Radio, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { isNotEmpty } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import { UmamiTags } from 'components/umami/Umami';

type Props = {
  form: UseFormReturn<LovOgMedlemskapVurderingForm>;
  readOnly: boolean;
  index: number;
};

export const LovvalgOgMedlemskapFormInput = ({ readOnly, index, form }: Props) => {
  const { control, watch } = form;

  return (
    <VStack gap="space-16">
      <HStack justify={'space-between'}>
        <DateInputWrapper
          dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO}
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: (value) => validerDato(value as string),
          }}
          readOnly={readOnly}
        />
      </HStack>
      <HvordanLeggeTilSluttdatoReadMore />
      <TextAreaWrapper
        dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE}
        name={`vurderinger.${index}.lovvalg.begrunnelse`}
        control={control}
        label="Vurder riktig lovvalg"
        rules={{
          required: 'Du må gi en begrunnelse på lovvalg',
        }}
        readOnly={readOnly}
      />
      <RadioGroupWrapper
        name={`vurderinger.${index}.lovvalg.lovvalgsEØSLand`}
        dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS}
        control={control}
        label={'Hva er riktig lovvalgsland?'}
        rules={{
          validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge riktig lovvalgsland'),
        }}
        readOnly={readOnly}
        size={'small'}
      >
        {[
          { label: 'Norge', value: 'Norge' },
          { label: 'Annet land med avtale', value: 'Annet land med avtale' },
        ].map((option) => (
          <Radio key={`radio-${option.value}`} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </RadioGroupWrapper>
      {watch(`vurderinger.${index}.lovvalg.lovvalgsEØSLand`) === 'Annet land med avtale' && (
        <ComboboxWrapper
          name={`vurderinger.${index}.lovvalg.annetLovvalgslandMedAvtale`}
          dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET}
          control={control}
          label="Velg land som vi vurderer som lovvalgsland"
          options={landMedTrygdesamarbeid}
          rules={{ validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge et land') }}
          readOnly={readOnly}
        />
      )}
      {watch(`vurderinger.${index}.lovvalg.lovvalgsEØSLand`) === 'Norge' && (
        <>
          <TextAreaWrapper
            name={`vurderinger.${index}.medlemskap.begrunnelse`}
            dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE}
            control={control}
            label="Vurder brukerens medlemskap"
            rules={{
              required: 'Du må begrunne medlemskapsvurderingen',
            }}
            readOnly={readOnly}
          />
          <RadioGroupJaNei
            name={`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`}
            dataUmamiEvent={UmamiTags.LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN}
            control={control}
            label="Var brukeren medlem av folketrygden?"
            horisontal={true}
            rules={{ required: 'Du må velg om brukeren var medlem av folketrygden' }}
            readOnly={readOnly}
          />
        </>
      )}
    </VStack>
  );
};
