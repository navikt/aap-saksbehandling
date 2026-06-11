'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { DagpengerKilde, DagpengerYtelserType, TiltakspengerKilde, TiltakspengerYtelserType } from 'lib/types/types';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const dagpengerKildeOptions: { value: DagpengerKilde; label: string }[] = [
  { value: 'ARENA', label: 'ARENA' },
  { value: 'DP_SAK', label: 'DP_SAK' },
];

const dagpengerYtelsesOptions: { value: DagpengerYtelserType; label: string }[] = [
  { value: 'DAGPENGER_ARBEIDSSOKER_ORDINAER', label: 'Arbeidssøker Ordinær' },
  { value: 'DAGPENGER_PERMITTERING_ORDINAER', label: 'Permittering Ordinær' },
  { value: 'DAGPENGER_PERMITTERING_FISKEINDUSTRI', label: 'Permittering Fiskeindustri' },
];

const tiltakspengerKildeOptions: { value: TiltakspengerKilde; label: string }[] = [
  { value: 'TPSAK', label: 'TPSAK' },
  { value: 'ARENA', label: 'ARENA' },
];

const tiltakspengerYtelsesOptions: { value: TiltakspengerYtelserType; label: string }[] = [
  { value: 'TILTAKSPENGER', label: 'Tiltakspenger' },
  { value: 'TILTAKSPENGER_OG_BARNETILLEGG', label: 'Tiltakspenger og barnetillegg' },
];
export const OpprettSamordning = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'samordning',
  });

  return (
    <VStack gap="space-8">
      <Label>Samordning</Label>
      {fields.map((field, index) => (
        <HStack key={field.id} gap="space-8" align="end" wrap={false}>
          <SelectWrapper
            label="Type"
            size="small"
            control={form.control}
            name={`samordning.${index}.type`}
            rules={{
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const type = e.target.value;
                if (type === 'SYKEPENGER') {
                  form.setValue(`samordning.${index}.grad`, 100);
                  form.setValue(`samordning.${index}.dagpengerKilde`, undefined);
                  form.setValue(`samordning.${index}.dagpengerYtelseType`, undefined);
                  form.setValue(`samordning.${index}.tiltakspengerKilde`, undefined);
                  form.setValue(`samordning.${index}.tiltakspengerYtelseType`, undefined);
                } else if (type === 'DAGPENGER') {
                  form.setValue(`samordning.${index}.dagpengerKilde`, dagpengerKildeOptions[0].value);
                  form.setValue(`samordning.${index}.dagpengerYtelseType`, dagpengerYtelsesOptions[0].value);
                  form.setValue(`samordning.${index}.grad`, undefined);
                  form.setValue(`samordning.${index}.tiltakspengerKilde`, undefined);
                  form.setValue(`samordning.${index}.tiltakspengerYtelseType`, undefined);
                } else if (type === 'TILTAKSPENGER') {
                  form.setValue(`samordning.${index}.tiltakspengerKilde`, tiltakspengerKildeOptions[0].value);
                  form.setValue(`samordning.${index}.tiltakspengerYtelseType`, tiltakspengerYtelsesOptions[0].value);
                  form.setValue(`samordning.${index}.grad`, undefined);
                  form.setValue(`samordning.${index}.dagpengerKilde`, undefined);
                  form.setValue(`samordning.${index}.dagpengerYtelseType`, undefined);
                }
              },
            }}
          >
            <option value="SYKEPENGER">Sykepenger</option>
            <option value="DAGPENGER">Dagpenger</option>
            <option value="TILTAKSPENGER">Tiltakspenger</option>
          </SelectWrapper>

          <SamordningRadFelter form={form} index={index} />

          <DateInputWrapper label="Fra og med" control={form.control} name={`samordning.${index}.periode.fom`} />
          <DateInputWrapper label="Til og med" control={form.control} name={`samordning.${index}.periode.tom`} />

          <Button
            type="button"
            variant="tertiary"
            size="small"
            icon={<TrashIcon aria-hidden />}
            onClick={() => remove(index)}
          >
            Fjern
          </Button>
        </HStack>
      ))}
      <Button
        type="button"
        className="fit-content"
        size="small"
        variant="tertiary"
        icon={<PlusIcon aria-hidden />}
        onClick={() => append({ type: 'SYKEPENGER', periode: { fom: '', tom: '' } })}
      >
        Legg til samordning
      </Button>
    </VStack>
  );
};

const SamordningRadFelter = ({ form, index }: { form: UseFormReturn<OpprettSakFormFields>; index: number }) => {
  const type = useWatch({ control: form.control, name: `samordning.${index}.type` });

  if (type === 'SYKEPENGER') {
    return <TextFieldWrapper label="Grad" control={form.control} name={`samordning.${index}.grad`} type="text" />;
  }

  if (type === 'DAGPENGER') {
    return (
      <>
        <SelectWrapper label="Kilde" size="small" control={form.control} name={`samordning.${index}.dagpengerKilde`}>
          {dagpengerKildeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectWrapper>
        <SelectWrapper
          label="Ytelsestype"
          size="small"
          control={form.control}
          name={`samordning.${index}.dagpengerYtelseType`}
        >
          {dagpengerYtelsesOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectWrapper>
      </>
    );
  }

  if (type === 'TILTAKSPENGER') {
    return (
      <>
        <SelectWrapper
          label="Kilde"
          size="small"
          control={form.control}
          name={`samordning.${index}.tiltakspengerKilde`}
        >
          {tiltakspengerKildeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectWrapper>
        <SelectWrapper
          label="Ytelsestype"
          size="small"
          control={form.control}
          name={`samordning.${index}.tiltakspengerYtelseType`}
        >
          {tiltakspengerYtelsesOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectWrapper>
      </>
    );
  }

  return null;
};
