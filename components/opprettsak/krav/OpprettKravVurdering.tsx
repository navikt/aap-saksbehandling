'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { KravType, OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { subDays, subMonths } from 'date-fns';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

const defaultDato = formaterDatoForFrontend(subMonths(new Date(), 3));
const defaultMuligRettFra = formaterDatoForFrontend(subDays(subMonths(new Date(), 1), 5));
const kravTyperMedDatofelter: ReadonlySet<KravType> = new Set(['NYTT_KRAV_AAP', 'GJENOPPTAK']);

const KravRadFelter = ({ form, index }: { form: UseFormReturn<OpprettSakFormFields>; index: number }) => {
  const kravType = useWatch({ control: form.control, name: `kravVurderinger.${index}.kravType` }) ?? 'NYTT_KRAV_AAP';

  if (!kravTyperMedDatofelter.has(kravType)) return null;

  return (
    <>
      <DateInputWrapper label="Søknadsdato" control={form.control} name={`kravVurderinger.${index}.søknadsdato`} />
      <DateInputWrapper label="Kravdato" control={form.control} name={`kravVurderinger.${index}.kravdato`} />
      <DateInputWrapper label="Mulig rett fra" control={form.control} name={`kravVurderinger.${index}.muligRettFra`} />
    </>
  );
};

export const OpprettKravVurdering = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'kravVurderinger',
  });

  return (
    <VStack gap="space-8">
      <Label>Krav vurdering</Label>
      {fields.map((field, index) => (
        <HStack key={field.id} gap="space-8" align="end" wrap={false}>
          <SelectWrapper
            label="Kravtype"
            size="small"
            control={form.control}
            name={`kravVurderinger.${index}.kravType`}
            rules={{
              onChange: () => {
                form.setValue(`kravVurderinger.${index}.søknadsdato`, defaultDato);
                form.setValue(`kravVurderinger.${index}.kravdato`, defaultDato);
                form.setValue(`kravVurderinger.${index}.muligRettFra`, defaultMuligRettFra);
              },
            }}
          >
            <option value="NYTT_KRAV_AAP">Nytt krav AAP</option>
            <option value="GJENOPPTAK">Gjenopptak</option>
            <option value="TRUKKET_SØKNAD">Trukket søknad</option>
            <option value="KLAGE">Klage</option>
            <option value="TILLEGGSOPPLYSNING">Tilleggsopplysning</option>
          </SelectWrapper>

          <KravRadFelter form={form} index={index} />

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
        onClick={() =>
          append({
            kravType: 'NYTT_KRAV_AAP',
            søknadsdato: defaultDato,
            kravdato: defaultDato,
            muligRettFra: defaultMuligRettFra,
          })
        }
      >
        Legg til krav vurdering
      </Button>
    </VStack>
  );
};
