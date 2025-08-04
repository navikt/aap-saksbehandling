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
import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
  grunnlag: DigitaliseringsGrunnlag;
  registrertDato?: string | null;
}

export interface KlageFormFields {
  kravMottatt: string;
  beskrivelse: string;
  behandlingsreferanse: string | null;
}

const NY_KLAGEBEHANDLING_OPTION = 'NY_KLAGEBEHANDLING';

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
      beskrivelse: {
        type: 'textarea',
        label: 'Beskrivelse',
        rules: { required: 'Du må skrive en beskrivelse' },
      },
      behandlingsreferanse: {
        type: 'radio',
        label: 'Vil du legge dokumentet til en eksisterende klage, eller opprette en ny?',
        rules: { required: 'Du må velge et alternativ' },
        options: [
          ...grunnlag.klagebehandlinger.map((behandling) => ({
            label: `Klage opprettet ${formaterDatoForFrontend(behandling.opprettetDato)}`,
            value: behandling.behandlingsReferanse,
          })),
          { label: 'Opprett ny klagebehandling', value: NY_KLAGEBEHANDLING_OPTION },
        ],
      },
    },
    { readOnly }
  );

  function mapTilKlageKontrakt(data: KlageFormFields) {
    const behandlingsreferanse =
      data.behandlingsreferanse === NY_KLAGEBEHANDLING_OPTION ? null : data.behandlingsreferanse;
    const klageJournalføring: KlageV0 = {
      meldingType: 'KlageV0',
      beskrivelse: data.beskrivelse,
      kravMottatt: formaterDatoForBackend(parse(data.kravMottatt, 'dd.MM.yyyy', new Date())),
      behandlingReferanse: behandlingsreferanse,
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
        <FormField form={form} formField={formFields.behandlingsreferanse} />
        <FormField form={form} formField={formFields.beskrivelse} />
        <Button loading={isLoading} className={'fit-content'}>
          Neste
        </Button>
      </form>
    </VilkårsKort>
  );
};

DigitaliserKlage.displayName = 'DigitaliserKlage';
