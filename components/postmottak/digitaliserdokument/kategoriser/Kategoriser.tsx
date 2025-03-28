'use client';

import { KategoriserDokumentKategori } from 'lib/types/postmottakTypes';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { ServerSentEventStatusAlert } from 'components/postmottak/serversenteventstatusalert/ServerSentEventStatusAlert';
import { ServerSentEventStatus } from 'app/postmottak/api/post/[behandlingsreferanse]/hent/[gruppe]/[steg]/nesteSteg/route';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Button } from '@navikt/ds-react';

interface Props extends Submittable {
  kategori?: KategoriserDokumentKategori;
  readOnly: boolean;
  onKategoriChange: (kategori: KategoriserDokumentKategori) => void;
  status: ServerSentEventStatus | undefined;
}

interface FormFields {
  kategori: KategoriserDokumentKategori;
}

const kategorier: ValuePair<KategoriserDokumentKategori>[] = [
  {
    label: 'Søknad',
    value: 'SØKNAD',
  },
  {
    label: 'Meldekort',
    value: 'MELDEKORT',
  },
  {
    label: 'Legeerklæring',
    value: 'LEGEERKLÆRING',
  },
  {
    label: 'Klage',
    value: 'KLAGE',
  },
  {
    label: 'Annet relevant dokument',
    value: 'ANNET_RELEVANT_DOKUMENT',
  },
];

const kategorierSomSkalDigitaliseres: KategoriserDokumentKategori[] = [
  'SØKNAD',
  'MELDEKORT',
  'ANNET_RELEVANT_DOKUMENT',
];

export const Kategoriser = ({ kategori, readOnly, submit, onKategoriChange, status }: Props) => {
  const { formFields, form } = useConfigForm<FormFields>(
    {
      kategori: {
        type: 'combobox',
        label: 'Velg kategori for dokument',
        rules: { required: 'Du må velge kategori' },
        options: kategorier,
        defaultValue: kategori,
      },
    },
    { readOnly }
  );
  form.watch((value) => value.kategori && onKategoriChange(value.kategori));

  return (
    <VilkårsKort heading={'Kategoriser'}>
      <form onSubmit={form.handleSubmit((data) => submit(data.kategori, null, null))}>
        <ServerSentEventStatusAlert status={status} />
        <FormField form={form} formField={formFields.kategori} />
        {kategori && !kategorierSomSkalDigitaliseres.includes(kategori) && (
          <Button className={'fit-content'}>Neste</Button>
        )}
      </form>
    </VilkårsKort>
  );
};
