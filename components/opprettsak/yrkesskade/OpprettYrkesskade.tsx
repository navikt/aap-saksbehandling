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
  const harVedtaksdato = useWatch({ control: form.control, name: `yrkesskader.${index}.harVedtaksdato` });

  useEffect(() => {
    if (diagnose) {
      form.setValue(`yrkesskader.${index}.skadebeskrivelse`, diagnoseTilSkadebeskrivelse[diagnose] ?? '');
    }
  }, [diagnose]);

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
        checked={!!harVedtaksdato}
        defaultChecked
        onChange={(e) => {
          const vedtaksdato = e.target.checked ? formaterDatoForBackend(subDays(new Date(), 8)) : undefined;
          form.setValue(`yrkesskader.${index}.harVedtaksdato`, e.target.checked);
          form.setValue(`yrkesskader.${index}.vedtaksdato`, vedtaksdato);
        }}
      >
        Har vedtaksdato
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
              <SelectWrapper label="Kilde" control={form.control} name={`yrkesskader.${index}.kilde`}>
                {fields.some((f, i) => (yrkesskader?.[i]?.kilde ?? f.kilde) === 'SØKNAD' && i !== index) ? null : (
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
        onClick={() =>
          append({
            kilde: 'REGISTER',
            skadeart: skadeartOptions[0],
            diagnose: diagnoseOptions[0],
            skadebeskrivelse: diagnoseTilSkadebeskrivelse[diagnoseOptions[0]],
            yrkesskadeRegisterKilde: 'KOMPYS',
            harVedtaksdato: true,
            vedtaksdato: formaterDatoForBackend(subDays(new Date(), 8)),
          })
        }
      >
        Legg til yrkesskade
      </Button>
    </VStack>
  );
};
