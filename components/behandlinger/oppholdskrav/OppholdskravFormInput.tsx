import { Alert, Button, HStack, Link, ReadMore, VStack } from '@navikt/ds-react';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { RadioGroupJaNei } from 'components/form/radiogroupjanei/RadioGroupJaNei';
import { JaEllerNei } from 'lib/utils/form';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { isNotEmpty } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { VisningModus } from 'hooks/saksbehandling/visning/VisningHook';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { alleLandUtenNorge } from 'lib/utils/countries';
import { UseFormReturn } from 'react-hook-form';
import { OppholdskravForm } from 'components/behandlinger/oppholdskrav/types';
import { useState } from 'react';
import { validerDato } from 'lib/validation/dateValidation';
import { DateInputWrapperOnBlur } from 'components/form/dateinputwrapper/DateInputWrapperOnBlur';

type Props = {
  form: UseFormReturn<OppholdskravForm>;
  visningModus: VisningModus;
  readOnly: boolean;
  index: number;
  harTidligereVurderinger: boolean;
  onRemove: () => void;
};

const landSelectOptions = [alleLandUtenNorge[0], { label: 'Annet', value: 'ANNET' }, ...alleLandUtenNorge.slice(1)];

export const OppholdskravFormInput = ({
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
      <Link href="https://lovdata.no/nav/rundskriv/r11-00#ref/lov/1997-02-28-19/%C2%A711-3" target="_blank">
        Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-3 (lovdata.no)
      </Link>
      <TextAreaWrapper
        name={`vurderinger.${index}.begrunnelse`}
        control={control}
        label="Vilkårsvurdering"
        description="Vurder om brukeren har utenlandsopphold som ikke overholder bestemmelsene i § 11-3"
        rules={{
          required: 'Du må fylle ut en vilkårsvurdering',
        }}
        readOnly={readOnly}
      />
      <RadioGroupJaNei
        name={`vurderinger.${index}.oppfyller`}
        control={control}
        label="Oppfyller brukeren vilkårene i § 11-3?"
        horisontal={true}
        rules={{ required: 'Du må ta stilling til om brukeren oppfyller vilkårene' }}
        readOnly={readOnly}
      />

      {watch(`vurderinger.${index}.oppfyller`) === JaEllerNei.Nei && (
        <>
          <HStack>
            <Alert variant="warning" size="small">
              Pass på at kun den delen av utenlandsoppholdet som bryter vilkårene i § 11-3 legges inn
            </Alert>
          </HStack>
          <HStack>
            <ComboboxWrapper
              name={`vurderinger.${index}.land`}
              control={control}
              label="Hvilket land oppholder brukeren seg i?"
              options={landSelectOptions}
              rules={{ validate: (value) => (isNotEmpty(value) ? undefined : 'Du må velge et land') }}
              readOnly={readOnly}
            />
          </HStack>

          {watch(`vurderinger.${index}.land`) === 'ANNET' && (
            <HStack>
              <TextFieldWrapper
                name={`vurderinger.${index}.landAnnet`}
                control={control}
                type="text"
                label="Navn på land"
                rules={{ required: 'Du må skrive inn navnet på landet' }}
                readOnly={readOnly}
              />
            </HStack>
          )}
        </>
      )}
    </VStack>
  );
};
