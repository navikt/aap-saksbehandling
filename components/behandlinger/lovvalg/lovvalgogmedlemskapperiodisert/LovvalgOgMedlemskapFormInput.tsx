import { HStack, Radio, VStack } from '@navikt/ds-react';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { LovvalgMedlemskapFelt } from 'lib/utils/umami/hendelserVarighet';
import { validerDato } from 'lib/validation/dateValidation';
import { UseFormReturn } from 'react-hook-form';

import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { isNotEmpty } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';

type Props = {
  form: UseFormReturn<LovOgMedlemskapVurderingForm>;
  readOnly: boolean;
  index: number;
  umamiAddHendelse: (felt: LovvalgMedlemskapFelt, tidsstempel: number) => void;
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
          onBlur={() => umamiAddHendelse('FRA_DATO', Date.now())}
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
        onBlur={() => umamiAddHendelse('LOVVALG_BEGRUNNELSE', Date.now())}
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
            onBlur={() => umamiAddHendelse('LOVVALGSLAND_EØS', Date.now())}
          >
            {option.label}
          </Radio>
        ))}
      </RadioGroupWrapper>
      {watch(`vurderinger.${index}.lovvalg.lovvalgsEØSLand`) === 'Annet land med avtale' && (
        <ComboboxWrapper
          name={`vurderinger.${index}.lovvalg.annetLovvalgslandMedAvtale`}
          control={control}
          label="Velg land som vi vurderer som lovvalgsland"
          options={landMedTrygdesamarbeid}
          rules={{ validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge et land') }}
          readOnly={readOnly}
          onBlur={() => umamiAddHendelse('LOVVALGSLAND_ANNET', Date.now())}
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
            onBlur={() => umamiAddHendelse('MEDLEMSKAP_BEGRUNNELSE', Date.now())}
          />
          <RadioGroupJaNei
            name={`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`}
            control={control}
            label="Var brukeren medlem av folketrygden?"
            horisontal={true}
            rules={{ required: 'Du må velg om brukeren var medlem av folketrygden' }}
            readOnly={readOnly}
            onBlur={() => umamiAddHendelse('MEDLEMSKAP_I_FOLKETRYGDEN', Date.now())}
          />
        </>
      )}
    </VStack>
  );
};
