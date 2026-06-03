'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, Heading, HStack, VStack } from '@navikt/ds-react';
import { clientLeggTilYrkesskade } from 'lib/clientApi';
import { useFetch } from 'hooks/FetchHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { formaterDatoForBackend } from 'lib/utils/date';
import { subDays, subMonths } from 'date-fns';
import { KelvinAlert } from 'components/alert/KelvinAlert';

const skadeartOptions = ['Arbeidsulykke', 'Yrkessykdom', 'Annet'];
const diagnoseOptions = ['Lumbago', 'Karpaltunnelsyndrom', 'Håndleddsfraktur', 'Hørselstap', 'Hjernerystelse'];
const diagnoseTilSkadebeskrivelse: Record<string, string> = {
  Lumbago: 'Belastningsskade i korsrygg',
  Karpaltunnelsyndrom: 'Nerveskade i håndledd',
  Håndleddsfraktur: 'Bruddskade i håndledd',
  Hørselstap: 'Hørseltap i venstre øre',
  Hjernerystelse: 'Kjemikalieeksponering i hjerne',
};

interface YrkesskadeEntry {
  skadeart: string;
  diagnose: string;
  skadebeskrivelse: string;
  harSkadedato: boolean;
  skadedato?: string;
}

interface FormFields {
  yrkesskader: YrkesskadeEntry[];
}

const defaultYrkesskade = (): YrkesskadeEntry => ({
  skadeart: skadeartOptions[0],
  diagnose: diagnoseOptions[0],
  skadebeskrivelse: diagnoseTilSkadebeskrivelse[diagnoseOptions[0]],
  harSkadedato: true,
  skadedato: formaterDatoForBackend(subMonths(new Date(), 3)),
});

export const LeggTilMockYrkesskade = ({ saksnummer }: { saksnummer: string }) => {
  const { method: leggTilYrkesskade, isLoading, error } = useFetch(clientLeggTilYrkesskade);

  const form = useForm<FormFields>({
    defaultValues: { yrkesskader: [defaultYrkesskade()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'yrkesskader',
  });

  const send = async () => {
    const { yrkesskader } = form.getValues();
    leggTilYrkesskade(saksnummer, {
      yrkesskader: yrkesskader.map((y) => ({
        kilde: 'REGISTER',
        harYrkesskade: false,
        skadeart: y.skadeart,
        diagnose: y.diagnose,
        skadebeskrivelse: diagnoseTilSkadebeskrivelse[y.diagnose] ?? y.skadebeskrivelse,
        skadedato: y.harSkadedato ? y.skadedato : undefined,
      })),
    });
  };

  return (
    <VStack gap="space-8">
      <Heading size="small">Yrkesskade</Heading>
      {fields.map((field, index) => (
        <HStack key={field.id} gap="space-8" align="end">
          <SelectWrapper label="Skadeart" name={`yrkesskader.${index}.skadeart`} control={form.control}>
            {skadeartOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </SelectWrapper>

          <SelectWrapper label="Diagnose" name={`yrkesskader.${index}.diagnose`} control={form.control}>
            {diagnoseOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </SelectWrapper>

          <Checkbox
            size="small"
            {...form.register(`yrkesskader.${index}.harSkadedato`)}
            onChange={(e) => {
              form.setValue(
                `yrkesskader.${index}.skadedato`,
                e.target.checked ? formaterDatoForBackend(subDays(new Date(), 8)) : undefined
              );
              form.setValue(`yrkesskader.${index}.harSkadedato`, e.target.checked);
            }}
          >
            Har skadedato
          </Checkbox>

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
      <HStack gap="space-8">
        <Button
          type="button"
          variant="tertiary"
          size="small"
          icon={<PlusIcon aria-hidden />}
          onClick={() => append(defaultYrkesskade())}
        >
          Legg til yrkesskade
        </Button>
        <Button onClick={send} loading={isLoading} size="small">
          Lagre
        </Button>
      </HStack>
      {error && <KelvinAlert variant="error">{error}</KelvinAlert>}
    </VStack>
  );
};
