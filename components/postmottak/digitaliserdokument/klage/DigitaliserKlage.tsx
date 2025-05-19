'use client';

import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { Button } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { KlageV0 } from 'lib/types/types';
import { parse } from 'date-fns';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
  registrertDato?: string | null;
}
export interface KlageFormFields {
  kravMottatt: string;
}
export const DigitaliserKlage = ({ readOnly, submit, isLoading, registrertDato }: Props) => {
  const { form, formFields } = useConfigForm<KlageFormFields>(
    {
      kravMottatt: {
        type: 'date_input',
        label: 'Dato for mottatt klage',
        defaultValue: registrertDato ? formaterDatoForFrontend(registrertDato) : undefined,
        rules: { required: 'Kravdato for klage må settes' },
      },
    },
    { readOnly }
  );

  function mapTilKlageKontrakt(data: KlageFormFields) {
    const klageJournalføring: KlageV0 = {
      meldingType: 'KlageV0',
      kravMottatt: formaterDatoForBackend(parse(data.kravMottatt, 'dd.MM.yyyy', new Date())),
    };
    return JSON.stringify(klageJournalføring);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => submit('KLAGE', mapTilKlageKontrakt(data), null))(event);
  };
  return (
    <VilkårsKort heading={'Klage'}>
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.kravMottatt} />
        <Button loading={isLoading} className={'fit-content'}>
          Neste
        </Button>
      </form>
    </VilkårsKort>
  );
};

DigitaliserKlage.displayName = 'DigitaliserKlage';
