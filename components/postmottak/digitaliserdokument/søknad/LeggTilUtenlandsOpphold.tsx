import { Button } from '@navikt/ds-react/Button';
import { Radio } from '@navikt/ds-react/Radio';
import { HStack, VStack } from '@navikt/ds-react/Stack';
import { TextField } from '@navikt/ds-react/TextField';
import { TrashIcon } from '@navikt/aksel-icons';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from 'components/postmottak/digitaliserdokument/søknad/DigitaliserSøknad';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { ComboboxWrapper } from 'components/form/comboboxwrapper/ComboboxWrapper';
import { validerDato } from 'lib/validation/dateValidation';
import { JaEllerNeiOptions } from 'lib/postmottakForm';
import { alleLandUtenNorge } from 'lib/utils/countries';
import { parse } from 'date-fns';
import countries from 'i18n-iso-countries';
import styles from './Barnetillegg.module.css';

const { eeaMember } = require('is-european');

const EEA_EXTRA_ALPHA3 = ['GBR', 'CHE', 'IMN', 'JEY'];

function skalViseUtenlandsId(landAlpha3: string): boolean {
  if (!landAlpha3) return false;
  if (EEA_EXTRA_ALPHA3.includes(landAlpha3)) return true;
  const alpha2 = countries.alpha3ToAlpha2(landAlpha3);
  return alpha2 ? eeaMember(alpha2) : false;
}

interface Props {
  index: number;
  form: UseFormReturn<SøknadFormFields>;
  readOnly: boolean;
  remove: UseFieldArrayRemove;
}

export const LeggTilUtenlandsOpphold = ({ index, form, readOnly, remove }: Props) => {
  const land = form.watch(`utenlandsOpphold.${index}.land`);
  const fraDato = form.watch(`utenlandsOpphold.${index}.fraDato`);
  const visUtenlandsId = skalViseUtenlandsId(land);

  return (
    <VStack gap={'space-16'} className={styles.barn}>
      <ComboboxWrapper
        label={'Land'}
        name={`utenlandsOpphold.${index}.land`}
        control={form.control}
        options={alleLandUtenNorge}
        readOnly={readOnly}
        rules={{ required: 'Du må velge land', validate: (v) => v !== '' || 'Du må velge land' }}
      />
      <HStack gap={'space-16'}>
        <VStack>
          <DateInputWrapper
            label={'Fra dato'}
            name={`utenlandsOpphold.${index}.fraDato`}
            control={form.control}
            readOnly={readOnly}
            rules={{
              required: 'Du må oppgi fra dato',
              validate: { validerDato: (value) => validerDato(value as string) },
            }}
          />
        </VStack>
        <VStack>
          <DateInputWrapper
            label={'Til dato'}
            name={`utenlandsOpphold.${index}.tilDato`}
            control={form.control}
            readOnly={readOnly}
            rules={{
              required: 'Du må oppgi til dato',
              validate: {
                validerDato: (value) => validerDato(value as string),
                etterFraDato: (value) => {
                  if (!fraDato || !value) return true;
                  const fra = parse(fraDato as string, 'dd.MM.yyyy', new Date());
                  const til = parse(value as string, 'dd.MM.yyyy', new Date());
                  return til >= fra || 'Til dato må være etter fra dato';
                },
              },
            }}
          />
        </VStack>
      </HStack>
      <RadioGroupWrapper
        label={'Har brukeren oppgitt at de arbeidet i landet?'}
        name={`utenlandsOpphold.${index}.iArbeid`}
        control={form.control}
        readOnly={readOnly}
        rules={{ required: 'Du må velge et alternativ' }}
      >
        {JaEllerNeiOptions.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </RadioGroupWrapper>
      {visUtenlandsId && (
        <TextField
          label={'Utenlandsk ID-nummer'}
          size={'small'}
          readOnly={readOnly}
          {...form.register(`utenlandsOpphold.${index}.utenlandsId`)}
        />
      )}
      <HStack>
        <Button
          aria-label={'Slett'}
          size={'small'}
          icon={<TrashIcon title={'Fjern utenlandsopphold'} />}
          variant={'tertiary'}
          type={'button'}
          onClick={() => remove(index)}
          disabled={readOnly}
        >
          Fjern utenlandsopphold
        </Button>
      </HStack>
    </VStack>
  );
};
