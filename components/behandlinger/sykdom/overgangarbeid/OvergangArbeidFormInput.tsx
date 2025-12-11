import { Button, HStack, ReadMore, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { UseFormReturn } from 'react-hook-form';
import React, { useState } from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { DateInputWrapperOnBlur } from 'components/form/dateinputwrapper/DateInputWrapperOnBlur';
import { OvergangArbeidForm } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';

type Props = {
  form: UseFormReturn<OvergangArbeidForm>;
  visningModus: VisningModus;
  readOnly: boolean;
  index: number;
  harTidligereVurderinger: boolean;
  onRemove: () => void;
};

export const OvergangArbeidFormInput = ({
  readOnly,
  harTidligereVurderinger,
  index,
  visningModus,
  form,
  onRemove,
}: Props) => {
  const { control } = form;
  const [spinnerRemove, setSpinnerRemove] = useState(false);

  const handleRemove = (): void => {
    setSpinnerRemove(true);
    setTimeout(() => {
      onRemove();
      setSpinnerRemove(false);
    }, 500);
  };

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
        {(visningModus === VisningModus.AKTIV_MED_AVBRYT || visningModus === VisningModus.AKTIV_UTEN_AVBRYT) &&
          (index !== 0 || harTidligereVurderinger) && (
            <HStack>
              <VStack justify={'end'}>
                <Button
                  loading={spinnerRemove}
                  aria-label="Fjern vurdering"
                  variant="tertiary"
                  size="small"
                  icon={<TrashFillIcon />}
                  onClick={handleRemove}
                  type="button"
                ></Button>
              </VStack>
            </HStack>
          )}
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
