import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { SelectWrapper } from '../../form/selectwrapper/SelectWrapper';
import { ValuePair } from '../../form/FormField';
import { DagpengerKilde, DagpengerYtelseType } from '../../../lib/types/types';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const kildeOptions: ValuePair<DagpengerKilde>[] = [
  {
    value: 'ARENA',
    label: 'ARENA',
  },
  {
    value: 'DP_SAK',
    label: 'DP_SAK'
  },
];

const ytelsesOptions: ValuePair<DagpengerYtelseType>[] = [
  {
    value: 'DAGPENGER_ARBEIDSSOKER_ORDINAER',
    label: 'Dagpenger Arbeidssøker Ordinær',
  },
  {
    value: 'DAGPENGER_PERMITTERING_ORDINAER',
    label: 'Dagpenger Permittering Ordinær',
  },
  {
    value: 'DAGPENGER_PERMITTERING_FISKEINDUSTRI',
    label: 'Dagpenger Permittering Fiskeindustri',
  },
];

export const Dagpenger = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dagpenger',
  });
  
  return (
    <VStack gap={'2'}>
      <Label>Samordning, dagpenger</Label>
      {fields.map((field, index) => {
        return (
          <HStack key={field.id} gap={'2'} align={'end'}>
            <SelectWrapper
              label="Kilde"
              size={'small'}
              control={form.control}
              name={`dagpenger.${index}.kilde`}
              rules={{ required: 'Du må velge en kilde' }}
            >
              {kildeOptions.map((ytelse, index) => (
                <option value={ytelse.value} key={index}>
                  {ytelse.label}
                </option>
              ))}
            </SelectWrapper>
            <SelectWrapper
              label="Ytelsestype"
              size={'small'}
              control={form.control}
              name={`dagpenger.${index}.dagpengerYtelseType`}
              rules={{ required: 'Du må velge en ytelsetype' }}
            >
              {ytelsesOptions.map((ytelse, index) => (
                <option value={ytelse.value} key={index}>
                  {ytelse.label}
                </option>
              ))}
            </SelectWrapper>
            <DateInputWrapper label={`Fra og med`} control={form.control} name={`dagpenger.${index}.periode.fom`} />
            <DateInputWrapper label={`Til og med`} control={form.control} name={`dagpenger.${index}.periode.tom`} />
            <Button
              type="button"
              variant={'tertiary'}
              size={'small'}
              icon={<TrashIcon aria-hidden />}
              onClick={() => remove(index)}
            >
              Fjern samordning
            </Button>
          </HStack>
        );
      })}
      <Button
        type="button"
        className={'fit-content'}
        size={'small'}
        onClick={() => {
          append({
            dagpengerYtelseType: ytelsesOptions[0].value,
            kilde: kildeOptions[0].value,
            periode: { fom: '', tom: '' },
          });
        }}
        variant={'tertiary'}
        icon={<PlusIcon aria-hidden />}
      >
        Legg til samordning
      </Button>
    </VStack>
  );
};
