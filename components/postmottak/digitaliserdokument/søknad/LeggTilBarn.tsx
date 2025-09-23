import { Button, Checkbox, HStack, VStack } from '@navikt/ds-react';
import styles from 'components/postmottak/digitaliserdokument/søknad/Barnetillegg.module.css';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';
import { CheckboxWrapper } from 'components/form/checkboxwrapper/CheckboxWrapper';
import { TrashIcon } from '@navikt/aksel-icons';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from 'components/postmottak/digitaliserdokument/søknad/DigitaliserSøknad';
import { useEffect } from 'react';

interface Props {
  i: number;
  form: UseFormReturn<SøknadFormFields>;
  readOnly: boolean;
  remove: UseFieldArrayRemove;
}

export const LeggTilBarn = ({ i, form, readOnly, remove }: Props) => {
  const manglerIdent = form.watch(`oppgitteBarn.${i}.checkboxList`).includes('manglerIdent');
  useEffect(() => {
    if (manglerIdent) {
      form.setValue(`oppgitteBarn.${i}.fnr`, '');
      form.clearErrors(`oppgitteBarn.${i}.fnr`);
    }
  }, [manglerIdent]);
  return (
    <VStack key={`div-${i}`} gap={'4'} className={styles.barn}>
      <HStack gap={'4'}>
        <VStack>
          <TextFieldWrapper
            label={'Fornavn og mellomnavn'}
            type={'text'}
            className={styles.input}
            name={`oppgitteBarn.${i}.fornavn`}
            control={form.control}
            readOnly={readOnly}
            rules={{
              required: 'Du må oppgi fornavn på barnet',
            }}
          />
        </VStack>
        <VStack>
          <TextFieldWrapper
            label={'Etternavn'}
            type={'text'}
            className={styles.input}
            name={`oppgitteBarn.${i}.etternavn`}
            control={form.control}
            readOnly={readOnly}
            rules={{
              required: 'Du må oppgi etternavn på barnet',
            }}
          />
        </VStack>
      </HStack>
      <HStack gap={'4'}>
        <VStack>
          <SelectWrapper
            label={'Hva er relasjonen til barnet'}
            name={`oppgitteBarn.${i}.relasjon`}
            control={form.control}
            readOnly={readOnly}
            className={styles.input}
            rules={{
              required: 'Du må velge en relasjon.',
            }}
          >
            <option value={'FORELDER'}>Forelder</option>
            <option value={'FOSTERFORELDER'}>Fosterforelder</option>
          </SelectWrapper>
        </VStack>
        <VStack>
          <DateInputWrapper
            label={'Fødselsdato'}
            name={`oppgitteBarn.${i}.fødselsdato`}
            control={form.control}
            readOnly={readOnly}
            rules={{
              required: 'Du må oppgi fødselsdatoen på barnet',
              validate: {
                validerDato: (value) => validerDato(value as string),
                validerIkkeFørDato: (value) => {
                  if (erDatoIFremtiden(value as string)) {
                    return 'Fødselsdato kan ikke være i fremtiden';
                  }
                },
              },
            }}
          />
        </VStack>
      </HStack>
      <HStack>
        <VStack>
          {!manglerIdent && (
            <TextFieldWrapper
              label={'Fødselsnummer eller D-nummer'}
              type={'text'}
              className={styles.input}
              name={`oppgitteBarn.${i}.fnr`}
              control={form.control}
              readOnly={readOnly}
              rules={{
                required: 'Du må oppgi fødselsnummer eller D-nummer på barnet',
                validate: (value) => validerIdentLengde(value as string),
              }}
            />
          )}
          <CheckboxWrapper
            label={'Barn mangler ident'}
            hideLabel={true}
            readOnly={readOnly}
            control={form.control}
            name={`oppgitteBarn.${i}.checkboxList`}
          >
            <Checkbox value={'manglerIdent'}>Barn mangler fødselsnummer og D-nummer</Checkbox>
          </CheckboxWrapper>
        </VStack>
      </HStack>
      <HStack>
        <Button
          aria-label={'Slett'}
          size={'small'}
          icon={<TrashIcon title={'Fjern barn'} />}
          variant={'tertiary'}
          type={'button'}
          onClick={() => remove(i)}
          disabled={readOnly}
        >
          Fjern barn
        </Button>
      </HStack>
    </VStack>
  );
};

function validerIdentLengde(value: string) {
  if (value.length > 0 && !/^\d+$/.test(value)) {
    return 'Fødselsnummer eller D-nummer må kun inneholde tall';
  }
  if (value.length > 0 && value.length != 11) {
    return 'Fødselsnummer eller D-nummer må være 11 siffer';
  }
}
