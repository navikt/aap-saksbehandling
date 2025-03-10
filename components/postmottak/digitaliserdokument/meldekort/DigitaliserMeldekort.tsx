'use client';

import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { MeldePerioder } from './MeldePerioder';
import { Nesteknapp } from 'components/postmottak/nesteknapp/Nesteknapp';
import { MeldekortV0 } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';

interface Props extends Submittable {
  behandlingsVersjon: number;
  behandlingsreferanse: string;
  readOnly: boolean;
}
export type PliktDag = {
  dato?: Date;
  arbeidsTimer?: number;
};
export type PliktPeriode = {
  dager: Array<PliktDag>;
};
export interface PliktkortFormFields {
  innsendtDato?: Date;
  pliktPerioder?: PliktPeriode[];
}
export const DigitaliserMeldekort = ({ readOnly, submit }: Props) => {
  const { form, formFields } = useConfigForm<PliktkortFormFields>(
    {
      innsendtDato: {
        type: 'date',
        label: 'Innsendt dato',
      },
      pliktPerioder: {
        type: 'fieldArray',
        defaultValue: [],
      },
    },
    { readOnly }
  );

  function mapTilPliktkortKontrakt(data: PliktkortFormFields) {
    const dager: MeldekortV0['timerArbeidPerPeriode'] = (data.pliktPerioder ?? [])
      .flatMap((uke) => uke.dager)
      .map(({ dato, arbeidsTimer }) => ({
        fraOgMedDato: dato!.toISOString().slice(0, 10),
        tilOgMedDato: dato!.toISOString().slice(0, 10),
        timerArbeid: arbeidsTimer ?? 0,
      }));

    const meldekort: MeldekortV0 = {
      meldingType: MeldekortV0,
      harDuArbeidet: dager.some((dag) => dag.timerArbeid > 0),
      timerArbeidPerPeriode: dager,
    };
    return JSON.stringify(meldekort);
  }

  return (
    <VilkårsKort heading={'Meldekort'}>
      <form onSubmit={form.handleSubmit((data) => submit('MELDEKORT', mapTilPliktkortKontrakt(data), null))}>
        <FormField form={form} formField={formFields.innsendtDato} />
        <MeldePerioder form={form} readOnly={readOnly} />
        <Nesteknapp>Neste</Nesteknapp>
      </form>
    </VilkårsKort>
  );
};

DigitaliserMeldekort.displayName = 'DigitaliserMeldekort';
