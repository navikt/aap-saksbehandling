'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { clientLeggTilKravVurdering } from 'lib/clientApi';
import { useFetch } from 'hooks/FetchHook';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { Alert } from 'components/alert/Alert';
import { subMonths } from 'date-fns';

type KravType = 'RELEVANT_KRAV' | 'TRUKKET_SØKNAD' | 'KLAGE' | 'TILLEGGSOPPLYSNING';

interface KravVurderingEntry {
  kravType: KravType;
  søknadsdato?: string;
  muligRettFra?: string;
}

interface FormFields {
  kravVurderinger: KravVurderingEntry[];
}

const defaultDato = formaterDatoForBackend(subMonths(new Date(), 3));
const kravTyperMedDatofelter: ReadonlySet<KravType> = new Set(['RELEVANT_KRAV']);

const defaultKrav = (): KravVurderingEntry => ({
  kravType: 'RELEVANT_KRAV',
  søknadsdato: defaultDato,
  muligRettFra: undefined,
});

const KravRadFelter = ({ form, index }: { form: ReturnType<typeof useForm<FormFields>>; index: number }) => {
  const kravType = useWatch({ control: form.control, name: `kravVurderinger.${index}.kravType` });

  if (!kravTyperMedDatofelter.has(kravType)) return null;

  return (
    <>
      <DateInputWrapper label="Søknadsdato" control={form.control} name={`kravVurderinger.${index}.søknadsdato`} />
      <DateInputWrapper label="Mulig rett fra" control={form.control} name={`kravVurderinger.${index}.muligRettFra`} />
    </>
  );
};

export const LeggTilKravVurdering = ({ saksnummer }: { saksnummer: string }) => {
  const { method: leggTilKravVurdering, isLoading, error } = useFetch(clientLeggTilKravVurdering);

  const form = useForm<FormFields>({
    defaultValues: { kravVurderinger: [defaultKrav()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'kravVurderinger',
  });

  const send = async () => {
    const { kravVurderinger } = form.getValues();
    await leggTilKravVurdering(saksnummer, {
      kravVurderinger: kravVurderinger.map((k) => ({
        kravType: k.kravType,
        søknadsdato: k.søknadsdato,
        muligRettFra: k.muligRettFra,
      })),
    });
  };

  return (
    <VStack gap="space-8">
      <Heading size="small">Krav vurdering</Heading>
      {fields.map((field, index) => (
        <HStack key={field.id} gap="space-8" align="end" wrap={false}>
          <SelectWrapper
            label="Kravtype"
            size="small"
            control={form.control}
            name={`kravVurderinger.${index}.kravType`}
            rules={{
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                const type = e.target.value as KravType;
                if (kravTyperMedDatofelter.has(type)) {
                  form.setValue(`kravVurderinger.${index}.søknadsdato`, defaultDato);
                } else {
                  form.setValue(`kravVurderinger.${index}.søknadsdato`, undefined);
                  form.setValue(`kravVurderinger.${index}.muligRettFra`, undefined);
                }
              },
            }}
          >
            <option value="RELEVANT_KRAV">Nytt krav AAP</option>
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
          onClick={() => append(defaultKrav())}
        >
          Legg til nytt krav
        </Button>
        <Button onClick={send} loading={isLoading} size="small">
          Lagre
        </Button>
      </HStack>
      {error && <Alert variant="error">{error}</Alert>}
    </VStack>
  );
};
