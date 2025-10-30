import { Button, HStack, ReadMore, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { isNotEmpty } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { TrashIcon } from '@navikt/aksel-icons';
import { landMedTrygdesamarbeid } from 'lib/utils/countries';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';

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
      <ReadMore size={'small'} header="Hvordan legge til sluttdato?">
        For å legge til en sluttdato på denne vurderingen velger du “Legg til ny vurdering”. Det oppretter en ny
        vurdering, der du kan ha et annet utfall og en ny “gjelder fra” dato, som da vil gi sluttdato på den foregående
        (denne) vurderingen. Sluttdatoen for denne vurderingen blir satt til dagen før den nye vurderingen sin “gjelder
        fra” dato.
      </ReadMore>
      <TextAreaWrapper
        name={`vurderinger.${index}.lovvalg.begrunnelse`}
        control={control}
        label="Vurder riktig lovvalg ved angitt tidspunkt"
        rules={{
          required: 'Du må gi en begrunnelse på lovvalg ved angitt tidspunkt',
        }}
        readOnly={readOnly}
      />
      <ComboboxWrapper
        name={`vurderinger.${index}.lovvalg.lovvalgsEØSLand`}
        control={control}
        size={'small'}
        label="Hva er riktig lovvalgsland ved angitt tidspunkt?"
        options={[
          { label: 'Norge', value: 'Norge' },
          { label: 'Annet land med avtale', value: 'Annet land med avtale' },
        ]}
        rules={{
          validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge riktig lovvalg ved angitt tidspunkt'),
        }}
        readOnly={readOnly}
      />
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
            label="Vurder brukerens medlemskap på angitt tidspunkt"
            rules={{
              required: 'Du må begrunne medlemskap på angitt tidspunkt',
            }}
            readOnly={readOnly}
          />
          <RadioGroupJaNei
            name={`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`}
            control={control}
            label="Var brukeren medlem av folketrygden ved angitt tidspunkt?"
            horisontal={true}
            rules={{ required: 'Du må velg om brukeren var medlem av folketrygden på angitt tidspunkt' }}
            readOnly={readOnly}
          />
        </>
      )}

      {(visningModus === VisningModus.AKTIV_MED_AVBRYT || visningModus === VisningModus.AKTIV_UTEN_AVBRYT) &&
        (index !== 0 || harTidligereVurderinger) && (
          <HStack>
            <Button
              loading={spinnerRemove}
              aria-label="Fjern vurdering"
              variant="secondary"
              size="small"
              icon={<TrashIcon />}
              onClick={handleRemove}
              type="button"
            ></Button>
          </HStack>
        )}
    </VStack>
  );
};
