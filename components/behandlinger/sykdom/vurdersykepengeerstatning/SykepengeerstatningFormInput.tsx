import { HStack, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { JaEllerNei } from 'lib/utils/form';
import { UseFormReturn } from 'react-hook-form';
import React from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { SykepengeerstatningForm } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstating-types';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { grunnOptions } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstatning-utils';
import { DateInputWrapperOnBlur } from 'components/form/dateinputwrapper/DateInputWrapperOnBlur';

type Props = {
  form: UseFormReturn<SykepengeerstatningForm>;
  readOnly: boolean;
  index: number;
};

export const SykepengeerstatningFormInput = ({ readOnly, index, form }: Props) => {
  const { control, watch } = form;

  return (
    <VStack gap="5">
      <HStack justify={'space-between'}>
        <DateInputWrapperOnBlur
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
      <ReadMore style={{ maxWidth: '90ch' }} size={'small'} header="Hvordan legge til sluttdato?">
        For å legge til en sluttdato på denne vurderingen velger du “Legg til ny vurdering”. Det oppretter en ny
        vurdering, der du kan ha et annet utfall og en ny “gjelder fra” dato, som da vil gi sluttdato på den foregående
        (denne) vurderingen. Sluttdatoen for denne vurderingen blir satt til dagen før den nye vurderingen sin “gjelder
        fra” dato.
      </ReadMore>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={control}
        label="Vilkårsvurdering"
        description="Vurder om brukeren har krav på sykepengeerstatning"
        rules={{
          required: 'Du må begrunne avgjørelsen din.',
        }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.erOppfylt`}
        control={control}
        label="Har brukeren krav på sykepengeerstatning?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren har rett på AAP som sykepengeerstatning.' }}
        readOnly={readOnly}
      />

      {watch(`vurderinger.${index}.erOppfylt`) === JaEllerNei.Ja && (
        <RadioGroupWrapper
          name={`vurderinger.${index}.grunn`}
          control={control}
          label={'Velg én grunn'}
          rules={{ required: 'Du må velge én grunn' }}
          readOnly={readOnly}
        >
          {grunnOptions.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroupWrapper>
      )}
    </VStack>
  );
};
