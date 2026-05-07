'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, HStack, Label, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { JaEllerNei } from 'lib/utils/form';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { useEffect } from 'react';
import { formaterDatoForBackend } from 'lib/utils/date';
import { subDays } from 'date-fns';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const skadeartOptions = ['Arbeidsulykke', 'Yrkessykdom', 'Annet'];
const diagnoseOptions = ['Lumbago', 'Karpaltunnelsyndrom', 'Håndleddsfraktur', 'Hørselstap', 'Hjernerystelse'];

const diagnoseTilSkadebeskrivelse: Record<string, string> = {
  Lumbago: 'Belastningsskade i korsrygg',
  Karpaltunnelsyndrom: 'Nerveskade i håndledd',
  Håndleddsfraktur: 'Bruddskade i håndledd',
  Hørselstap: 'Hørseltap i venstre øre',
  Hjernerystelse: 'Kjemikalieeksponering i hjerne',
};

const RegisterYrkesskadeFields = ({ form, index }: { form: UseFormReturn<OpprettSakFormFields>; index: number }) => {
  const diagnose = useWatch({ control: form.control, name: `yrkesskader.${index}.diagnose` });
  const harSkadedato = useWatch({ control: form.control, name: `yrkesskader.${index}.harSkadedato` });

  useEffect(() => {
    if (diagnose) {
      form.setValue(`yrkesskader.${index}.skadebeskrivelse`, diagnoseTilSkadebeskrivelse[diagnose] ?? '');
    }
  }, [diagnose, form, index]);

  return (
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
      <Checkbox
        size="small"
        checked={!!harSkadedato}
        onChange={(e) => {
          const skadedato = e.target.checked ? formaterDatoForBackend(subDays(new Date(), 8)) : undefined;
          form.setValue(`yrkesskader.${index}.harSkadedato`, e.target.checked);
          form.setValue(`yrkesskader.${index}.skadedato`, skadedato);
        }}
      >
        Har skadedato
      </Checkbox>
    </>
  );
};

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
              <SelectWrapper
                label="Kilde"
                control={form.control}
                name={`yrkesskader.${index}.kilde`}
                rules={{
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const nyKilde = e.target.value;
                    if (nyKilde === 'REGISTER') {
                      form.setValue(`yrkesskader.${index}.harYrkesskade`, JaEllerNei.Nei);
                      form.setValue(`yrkesskader.${index}.skadeart`, skadeartOptions[0]);
                      form.setValue(`yrkesskader.${index}.diagnose`, diagnoseOptions[0]);
                      form.setValue(`yrkesskader.${index}.skadebeskrivelse`, diagnoseTilSkadebeskrivelse[diagnoseOptions[0]]);
                      form.setValue(`yrkesskader.${index}.harSkadedato`, false);
                      form.setValue(`yrkesskader.${index}.skadedato`, undefined);
                    } else {
                      form.setValue(`yrkesskader.${index}.harYrkesskade`, JaEllerNei.Ja);
                      form.setValue(`yrkesskader.${index}.skadeart`, undefined);
                      form.setValue(`yrkesskader.${index}.diagnose`, undefined);
                      form.setValue(`yrkesskader.${index}.skadebeskrivelse`, undefined);
                      form.setValue(`yrkesskader.${index}.harSkadedato`, false);
                      form.setValue(`yrkesskader.${index}.skadedato`, undefined);
                    }
                  },
                }}
              >
                {!yrkesskader?.some((y, i) => y.kilde === 'SØKNAD' && i !== index) && (
                  <option value="SØKNAD">Fra søknad</option>
                )}
                <option value="REGISTER">Fra registeret</option>
              </SelectWrapper>

              {kilde === 'SØKNAD' && (
                <SelectWrapper
                  label="Har yrkesskade?"
                  control={form.control}
                  name={`yrkesskader.${index}.harYrkesskade`}
                >
                  <option value={JaEllerNei.Ja}>Ja</option>
                  <option value={JaEllerNei.Nei}>Nei</option>
                </SelectWrapper>
              )}

              {(kilde ?? 'REGISTER') === 'REGISTER' && <RegisterYrkesskadeFields form={form} index={index} />}

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
        onClick={() => {
          const harSøknad = yrkesskader?.some((y) => y.kilde === 'SØKNAD');
          if (harSøknad) {
            append({
              kilde: 'REGISTER',
              harYrkesskade: JaEllerNei.Nei,
              skadeart: skadeartOptions[0],
              diagnose: diagnoseOptions[0],
              skadebeskrivelse: diagnoseTilSkadebeskrivelse[diagnoseOptions[0]],
              yrkesskadeRegisterKilde: 'KOMPYS',
              harSkadedato: false,
              skadedato: undefined,
            });
          } else {
            append({
              kilde: 'SØKNAD',
              harYrkesskade: JaEllerNei.Ja,
              skadeart: undefined,
              diagnose: undefined,
              skadebeskrivelse: undefined,
              yrkesskadeRegisterKilde: undefined,
              harSkadedato: false,
              skadedato: undefined,
            });
          }
        }}
      >
        Legg til yrkesskade
      </Button>
    </VStack>
  );
};
