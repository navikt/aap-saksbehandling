import { Button, HStack, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { isNotEmpty } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { UseFormReturn } from 'react-hook-form';
import React, { useState } from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { VurderingId } from 'components/form/vurderingid/VurderingId';

type Props = {
  form: UseFormReturn<LovOgMedlemskapVurderingForm>;
  visningModus: VisningModus;
  readOnly: boolean;
  index: number;
  harTidligereVurderinger: boolean;
  onRemove: () => void;
};

export const LovvalgOgMedlemskapFormInput = ({
  readOnly,
  harTidligereVurderinger,
  index,
  visningModus,
  form,
  onRemove,
}: Props) => {
  const { control, watch } = form;
  const [spinnerRemove, setSpinnerRemove] = useState(false);

  const handleRemove = (): void => {
    setSpinnerRemove(true);
    setTimeout(() => {
      onRemove();
      setSpinnerRemove(false);
    }, 500);
  };

  return (
    <VStack gap="4">
      <VurderingId fieldArrayName={'vurderinger'} fieldName={'vurderingId'} index={index} control={control} />
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
            control={control}
            label="Vurder brukerens medlemskap"
            rules={{
              required: 'Du må begrunne medlemskapsvurderingen',
            }}
            readOnly={readOnly}
          />
          <RadioGroupJaNei
            name={`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`}
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
