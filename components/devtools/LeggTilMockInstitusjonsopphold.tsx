import { Alert, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { clientLeggTilInstitusjonsopphold } from 'lib/clientApi';
import { useConfigForm } from 'components/form/FormHook';
import { addMonths } from 'date-fns';
import { FormField } from 'components/form/FormField';
import { useFetch } from 'hooks/FetchHook';

type Institusjon = 'FO' | 'HS';

interface Institusjonsopphold {
  institusjonstype: Institusjon;
  oppholdFom: Date;
  oppholdTom: Date;
}

export const LeggTilMockInstitusjonsopphold = ({ saksnummer }: { saksnummer: string }) => {
  const { method: leggTilInst, isLoading, error } = useFetch(clientLeggTilInstitusjonsopphold);

  const { formFields, form } = useConfigForm<Institusjonsopphold>({
    institusjonstype: {
      type: 'radio',
      label: 'Institusjonstype',
      defaultValue: 'FO',
      options: [
        { label: 'Fengsel', value: 'FO' },
        { label: 'Helseinstitusjon', value: 'HS' },
      ],
    },
    oppholdFom: {
      type: 'date',
      label: 'Fom.',
      defaultValue: new Date(),
    },
    oppholdTom: {
      type: 'date',
      label: 'Tom.',
      defaultValue: addMonths(new Date(), 3),
    },
  });

  const send = async () => {
    const { institusjonstype, oppholdFom, oppholdTom } = form.getValues();

    leggTilInst(saksnummer, {
      institusjonstype,
      oppholdstype: institusjonstype === 'HS' ? 'H' : 'S',
      oppholdFom,
      oppholdTom,
    });
  };

  return (
    <VStack gap="2">
      <Heading size="small">Institusjonsopphold</Heading>
      <FormField form={form} formField={formFields.institusjonstype} horizontalRadio={true} />

      <HStack gap="2">
        <FormField form={form} formField={formFields.oppholdFom} />
        <FormField form={form} formField={formFields.oppholdTom} />
      </HStack>

      <div>
        <Button onClick={send} loading={isLoading}>
          Legg til
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </VStack>
  );
};
