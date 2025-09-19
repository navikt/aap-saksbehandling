import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { LeggTilBarn } from 'components/postmottak/digitaliserdokument/søknad/LeggTilBarn';

interface Props {
  form: UseFormReturn<SøknadFormFields>;
  readOnly: boolean;
}
export const Barnetillegg = ({ form, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'oppgitteBarn' });

  return (
    <VStack gap={'2'}>
      <Label size={'small'}>Har søker barn?</Label>
      {fields.length > 0 && (
        <>
          {fields.map((_, i) => {
            return <LeggTilBarn i={i} form={form} readOnly={readOnly} remove={remove} key={`div-${i}`} />;
          })}
        </>
      )}
      <HStack>
        <Button
          variant={'secondary'}
          icon={<PlusCircleFillIcon title={'Legg til barn'} />}
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
