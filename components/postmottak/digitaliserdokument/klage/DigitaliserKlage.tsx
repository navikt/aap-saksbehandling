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
import { getJaNeiEllerUndefined, JaEllerNeiOptions } from 'lib/utils/form';
import { JaEllerNei } from 'lib/postmottakForm';
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
  grunnlag: DigitaliseringsGrunnlag;
  registrertDato?: string | null;
}
export interface KlageFormFields {
  kravMottatt: string;
  skalOppretteNyBehandling: JaEllerNei;
  beskrivelse: string;
}
export const DigitaliserKlage = ({ readOnly, submit, grunnlag, isLoading, registrertDato }: Props) => {
  const vurdering: KlageV0 | null = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : null;

  const registrertDatoForInput = vurdering?.kravMottatt
    ? formaterDatoForFrontend(vurdering.kravMottatt)
    : registrertDato && !readOnly
      ? formaterDatoForFrontend(registrertDato)
      : undefined;
  const { form, formFields } = useConfigForm<KlageFormFields>(
    {
      kravMottatt: {
        type: 'date_input',
        label: 'Dato for mottatt klage',
        defaultValue: registrertDatoForInput,
        rules: { required: 'Kravdato for klage må settes' },
      },
      skalOppretteNyBehandling: {
        type: 'radio',
        label: 'Opprett ny klagebehandling i Kelvin',
        description:
          'Dersom dokumentet som journalføres skal knyttes til en eksisterende klagebehandling så kan du velge "Nei" her.',
        rules: { required: 'Du må ta stilling til om det skal opprettes en ny klagebehandling' },
        defaultValue: getJaNeiEllerUndefined(vurdering?.skalOppretteNyBehandling),
        options: JaEllerNeiOptions,
      },
      beskrivelse: {
        type: 'textarea',
        label: 'Beskrivelse',
        rules: { required: 'Du må skrive en beskrivelse' },
      },
    },
    { readOnly }
  );

  function mapTilKlageKontrakt(data: KlageFormFields) {
    const klageJournalføring: KlageV0 = {
      meldingType: 'KlageV0',
      beskrivelse: data.beskrivelse,
      kravMottatt: formaterDatoForBackend(parse(data.kravMottatt, 'dd.MM.yyyy', new Date())),
      skalOppretteNyBehandling: data.skalOppretteNyBehandling === JaEllerNei.Ja,
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
        <FormField form={form} formField={formFields.skalOppretteNyBehandling} horizontalRadio />
        <FormField form={form} formField={formFields.beskrivelse} />
        <Button loading={isLoading} className={'fit-content'}>
          Neste
        </Button>
      </form>
    </VilkårsKort>
  );
};

DigitaliserKlage.displayName = 'DigitaliserKlage';
