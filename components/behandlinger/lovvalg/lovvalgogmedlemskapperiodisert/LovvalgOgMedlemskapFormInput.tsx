import { Radio } from '@navikt/ds-react/Radio';
import { HStack, VStack } from '@navikt/ds-react/Stack';
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
import { UmamiTag } from 'lib/types/types';

type Props = {
  form: UseFormReturn<LovOgMedlemskapVurderingForm>;
  readOnly: boolean;
  index: number;
  umamiAddHendelse: (hendelse: UmamiTag, tidsstempel: number) => void;
};

export const LovvalgOgMedlemskapFormInput = ({ readOnly, index, form, umamiAddHendelse }: Props) => {
  const { control, watch } = form;

  return (
    <VStack gap="space-16">
      <HStack justify={'space-between'}>
        <DateInputWrapper
          name={`vurderinger.${index}.fraDato`}
          label="Vurderingen gjelder fra"
          control={control}
          rules={{
            required: 'Du må velge fra hvilken dato vurderingen gjelder fra',
            validate: (value) => validerDato(value as string),
          }}
          readOnly={readOnly}
          onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_FRA_DATO', Date.now())}
        />
      </HStack>
      <HvordanLeggeTilSluttdatoReadMore />
      <TextAreaWrapper
        name={`vurderinger.${index}.lovvalg.begrunnelse`}
        control={control}
        label="Vurder riktig lovvalg"
        rules={{
          required: 'Du må gi en begrunnelse på lovvalg',
        }}
        readOnly={readOnly}
        onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_LOVVALG_BEGRUNNELSE', Date.now())}
      />
      <RadioGroupWrapper
        name={`vurderinger.${index}.lovvalg.lovvalgsEØSLand`}
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
          <Radio
            key={`radio-${option.value}`}
            value={option.value}
            onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_EØS', Date.now())}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroupWrapper>
      {watch(`vurderinger.${index}.lovvalg.lovvalgsEØSLand`) === 'Annet land med avtale' && (
        <ComboboxWrapper
          name={`vurderinger.${index}.lovvalg.annetLovvalgslandMedAvtale`}
          dataUmamiEvent={'LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET'}
          control={control}
          label="Velg land som vi vurderer som lovvalgsland"
          options={landMedTrygdesamarbeid}
          rules={{ validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge et land') }}
          readOnly={readOnly}
          onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_LOVVALGSLAND_ANNET', Date.now())}
        />
      )}
      {watch(`vurderinger.${index}.lovvalg.lovvalgsEØSLand`) === 'Norge' && (
        <>
          <TextAreaWrapper
            name={`vurderinger.${index}.medlemskap.begrunnelse`}
            control={control}
            label="Vurder brukerens medlemskap"
            rules={{
              required: 'Du må begrunne medlemskapsvurderingen',
            }}
            readOnly={readOnly}
            onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_BEGRUNNELSE', Date.now())}
          />
          <RadioGroupJaNei
            name={`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`}
            control={control}
            label="Var brukeren medlem av folketrygden?"
            horisontal={true}
            rules={{ required: 'Du må velg om brukeren var medlem av folketrygden' }}
            readOnly={readOnly}
            onBlur={() => umamiAddHendelse('LOVVALG_MEDLEMSKAP_INPUT_MEDLEMSKAP_I_FOLKETRYGDEN', Date.now())}
          />
        </>
      )}
    </VStack>
  );
};
