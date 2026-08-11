'use client';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, VStack } from '@navikt/ds-react';
import { parse } from 'date-fns';
import { useFetch } from 'hooks/FetchHook';
import { clientLeggTilKravVurdering } from 'lib/clientApi';
import { formaterDatoForBackend } from 'lib/utils/date';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Alert } from 'components/alert/Alert';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

type KravType = 'RELEVANT_KRAV' | 'TRUKKET_SØKNAD' | 'KLAGE' | 'TILLEGGSOPPLYSNING';

interface KravVurderingEntry {
  kravType: KravType;
  søknadsdato: string;
  muligRettFra: string;
}

interface FormFields {
  kravVurderinger: KravVurderingEntry[];
}

const kravTyperMedDatofelter: ReadonlySet<KravType> = new Set(['RELEVANT_KRAV']);

const defaultKrav = (): KravVurderingEntry => ({
  kravType: 'RELEVANT_KRAV',
  søknadsdato: '',
  muligRettFra: '',
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
        søknadsdato: formaterDatoForBackend(parse(k.søknadsdato, 'dd.MM.yyyy', new Date())),
        muligRettFra: formaterDatoForBackend(parse(k.muligRettFra, 'dd.MM.yyyy', new Date())),
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
