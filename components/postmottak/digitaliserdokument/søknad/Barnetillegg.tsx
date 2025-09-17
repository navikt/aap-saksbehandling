import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { PlusCircleFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import styles from './Barnetillegg.module.css';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';

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
                        required: 'Fornavn er påkrevd.',
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
                        required: 'Etternavn er påkrevd.',
                      }}
                    />
                  </VStack>
                </HStack>
                <HStack gap={'4'}>
                  <VStack>
                    <TextFieldWrapper
                      label={'Fødselsnummer eller D-nummer (Valgfritt)'}
                      type={'text'}
                      className={styles.input}
                      name={`oppgitteBarn.${i}.fnr`}
                      control={form.control}
                      readOnly={readOnly}
                    />
                  </VStack>
                  <VStack>
                    <DateInputWrapper
                      label={'Fødselsdato'}
                      name={`oppgitteBarn.${i}.fødselsdato`}
                      control={form.control}
                      readOnly={readOnly}
                      rules={{
                        required: 'Du må oppgi fødselsdato for barnet.',
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
          onClick={() => append({ etternavn: '', fnr: '', fornavn: '', fødselsdato: '', relasjon: 'FORELDER' })}
        >
          Legg til barn
        </Button>
      </HStack>
    </VStack>
  );
};
