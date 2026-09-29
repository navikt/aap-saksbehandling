import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { LeggTilBarn } from 'components/postmottak/digitaliserdokument/søknad/LeggTilBarn';
import { SøknadFormFields } from 'components/postmottak/digitaliserdokument/søknad/DigitaliserSøknad';

interface Props {
  readOnly: boolean;
}

export const Barnetillegg = ({ readOnly }: Props) => {
  const form = useFormContext<SøknadFormFields>();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'oppgitteBarn' });

  return (
    <VStack gap={'space-8'}>
      <Label size={'small'}>Har brukeren oppgitt at de har barn under 18 år?</Label>
      {fields.length > 0 && (
        <>
          {fields.map((_, index) => {
            return <LeggTilBarn index={index} form={form} readOnly={readOnly} remove={remove} key={`div-${index}`} />;
          })}
        </>
      )}
      <HStack>
        <Button
          variant={'secondary'}
          icon={<PlusCircleFillIcon />}
          disabled={readOnly}
          size={'small'}
          type={'button'}
          onClick={() =>
            append({ etternavn: '', fnr: '', fornavn: '', fødselsdato: '', relasjon: 'FORELDER', checkboxList: [] })
          }
        >
          Legg til barn
        </Button>
      </HStack>
    </VStack>
  );
};
