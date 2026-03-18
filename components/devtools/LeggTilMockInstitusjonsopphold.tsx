import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { clientLeggTilInstitusjonsopphold } from 'lib/clientApi';
import { parse } from 'date-fns';
import { useFetch } from 'hooks/FetchHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { formaterDatoForBackend } from 'lib/utils/date';

interface InstitusjonsoppholdItem {
  institusjonstype: 'FO' | 'HS';
  oppholdFom: string;
  oppholdTom: string;
}

interface FormFields {
  opphold: InstitusjonsoppholdItem[];
}

const nyttOpphold = (): InstitusjonsoppholdItem => ({
  institusjonstype: 'HS',
  oppholdFom: '',
  oppholdTom: '',
});

export const LeggTilMockInstitusjonsopphold = ({ saksnummer }: { saksnummer: string }) => {
  const { method: leggTilInst, isLoading, error } = useFetch(clientLeggTilInstitusjonsopphold);

  const form = useForm<FormFields>({
    defaultValues: { opphold: [nyttOpphold()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'opphold',
  });

  const send = async () => {
    const { opphold } = form.getValues();
    leggTilInst(saksnummer, {
      opphold: opphold.map((item) => ({
        institusjonstype: item.institusjonstype,
        oppholdstype: item.institusjonstype === 'HS' ? 'H' : 'S',
        oppholdFom: formaterDatoForBackend(parse(item.oppholdFom, 'dd.MM.yyyy', new Date())),
        oppholdTom: formaterDatoForBackend(parse(item.oppholdTom, 'dd.MM.yyyy', new Date())),
      })),
    });
  };

  return (
    <VStack gap="2">
      <Heading size="small">Institusjonsopphold</Heading>

      {fields.map((field, index) => (
        <HStack key={field.id} gap="2" align="end">
          <SelectWrapper label="Institusjonstype" name={`opphold.${index}.institusjonstype`} control={form.control}>
            <option value="HS">Helseinstitusjon</option>
            <option value="FO">Fengsel</option>
          </SelectWrapper>

          <DateInputWrapper label="Fom." name={`opphold.${index}.oppholdFom`} control={form.control} />

          <DateInputWrapper label="Tom." name={`opphold.${index}.oppholdTom`} control={form.control} />

          <Button
            type="button"
            variant="tertiary"
            size="small"
            icon={<TrashIcon aria-hidden />}
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            Fjern
          </Button>
        </HStack>
      ))}

      <HStack gap="2">
        <Button
          type="button"
          variant="tertiary"
          size="small"
          icon={<PlusIcon aria-hidden />}
          onClick={() => append(nyttOpphold())}
        >
          Legg til opphold
        </Button>

        <Button onClick={send} loading={isLoading} size="small">
          Lagre
        </Button>
      </HStack>

      {error && <Alert variant="error">{error}</Alert>}
    </VStack>
  );
};
