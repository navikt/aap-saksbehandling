import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { ValuePair } from 'components/form/FormField';
import { TiltakspengerKilde, TiltakspengerYtelserType } from 'lib/types/types';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const kildeOptions: ValuePair<TiltakspengerKilde>[] = [
  {
    value: 'TPSAK',
    label: 'TPSAK',
  },
  {
    value: 'ARENA',
    label: 'ARENA',
  },
];

const ytelsesOptions: ValuePair<TiltakspengerYtelserType>[] = [
  {
    value: 'TILTAKSPENGER',
    label: 'Tiltakspenger',
  },
  {
    value: 'TILTAKSPENGER_OG_BARNETILLEGG',
    label: 'Tiltakspenger og barnetillegg',
  },
];

export const Tiltakspenger = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tiltakspenger',
  });

  return (
    <VStack gap={'space-8'}>
      <Label>Samordning, tiltakspenger</Label>
      {fields.map((field, index) => {
        return (
          <HStack key={field.id} gap={'space-8'} align={'end'} wrap={false}>
            <SelectWrapper
              label="Kilde"
              size={'small'}
              control={form.control}
              name={`tiltakspenger.${index}.kilde`}
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
              name={`tiltakspenger.${index}.ytelseType`}
              rules={{ required: 'Du må velge en ytelsetype' }}
            >
              {ytelsesOptions.map((ytelse, index) => (
                <option value={ytelse.value} key={index}>
                  {ytelse.label}
                </option>
              ))}
            </SelectWrapper>
            <DateInputWrapper label={`Fra og med`} control={form.control} name={`tiltakspenger.${index}.periode.fom`} />
            <DateInputWrapper label={`Til og med`} control={form.control} name={`tiltakspenger.${index}.periode.tom`} />
            <Button
              type="button"
              variant={'tertiary'}
              size={'small'}
              icon={<TrashIcon aria-hidden />}
              onClick={() => remove(index)}
            >
              Fjern
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
            ytelseType: ytelsesOptions[0].value,
            kilde: kildeOptions[0].value,
            periode: { fom: '', tom: '' },
          });
        }}
        variant={'tertiary'}
        icon={<PlusIcon aria-hidden />}
      >
        Legg til
      </Button>
    </VStack>
  );
};
