'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { JaEllerNei } from 'lib/utils/form';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const skadeartOptions = ['Arbeidsulykke', 'Yrkessykdom', 'Annet'];

const diagnoseOptions = ['Lumbago', 'Karpaltunnelsyndrom', 'Fraktur håndledd', 'Hørselstap', 'Hjernerystelse'];

const skadebeskrivelseOptions = [
  'Belastningsskade i korsrygg',
  'Bruddskade i håndledd',
  'Kuttskade i hånd',
  'Hørseltap i venstre øre',
  'Irritasjonsskade i lunger',
];

export const OpprettYrkesskade = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'yrkesskader',
  });

  const yrkesskader = useWatch({ control: form.control, name: 'yrkesskader' });

  return (
    <VStack gap="space-8">
      <Label>Yrkesskader</Label>
      {fields.map((field, index) => {
        const kilde = yrkesskader?.[index]?.kilde;
        return (
          <VStack key={field.id} gap="space-4">
            <HStack gap="space-8" align="end">
              <SelectWrapper label="Kilde" control={form.control} name={`yrkesskader.${index}.kilde`}>
                {fields.some((f, i) => (yrkesskader?.[i]?.kilde ?? f.kilde) === 'SØKNAD' && i !== index) ? null : (
                  <option value="SØKNAD">Fra søknad</option>
                )}
                <option value="REGISTER">Fra registeret</option>
              </SelectWrapper>

              {kilde === 'SØKNAD' &&
                fields.findIndex((f) => (yrkesskader?.[fields.indexOf(f)]?.kilde ?? f.kilde) === 'SØKNAD') ===
                  index && (
                  <SelectWrapper
                    label="Har yrkesskade?"
                    control={form.control}
                    name={`yrkesskader.${index}.harYrkesskade`}
                  >
                    <option value={JaEllerNei.Ja}>Ja</option>
                    <option value={JaEllerNei.Nei}>Nei</option>
                  </SelectWrapper>
                )}

              {(kilde ?? 'REGISTER') === 'REGISTER' && (
                <>
                  <SelectWrapper label="Skadeart" control={form.control} name={`yrkesskader.${index}.skadeart`}>
                    {skadeartOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </SelectWrapper>
                  <SelectWrapper label="Diagnose" control={form.control} name={`yrkesskader.${index}.diagnose`}>
                    {diagnoseOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </SelectWrapper>
                  <div style={{ display: 'none' }}>
                    <SelectWrapper
                      label="Skadebeskrivelse"
                      control={form.control}
                      name={`yrkesskader.${index}.skadebeskrivelse`}
                      readOnly={true}
                    >
                      <option value="">{skadebeskrivelseOptions[index] || 'Ingen beskrivelse'}</option>
                    </SelectWrapper>
                  </div>
                </>
              )}

              <Button
                type="button"
                variant="tertiary"
                size="xsmall"
                icon={<TrashIcon aria-hidden />}
                onClick={() => remove(index)}
              >
                Fjern
              </Button>
            </HStack>
          </VStack>
        );
      })}
      <Button
        type="button"
        variant="tertiary"
        size="xsmall"
        icon={<PlusIcon aria-hidden />}
        className="fit-content"
        onClick={() =>
          append({
            kilde: 'REGISTER',
            harYrkesskade: JaEllerNei.Nei,
            skadeart: skadeartOptions[0],
            diagnose: diagnoseOptions[0],
            skadebeskrivelse: skadebeskrivelseOptions[0],
            yrkesskadeRegisterKilde: Math.random() < 0.5 ? 'KOMPYS' : 'INFOTRYGD',
          })
        }
      >
        Legg til yrkesskade
      </Button>
    </VStack>
  );
};
