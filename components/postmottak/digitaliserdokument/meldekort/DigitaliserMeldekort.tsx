'use client';

import { MeldePerioder } from './MeldePerioder';
import { MeldekortV0 } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { Button } from '@navikt/ds-react';
import { FormEvent } from 'react';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
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
export const DigitaliserMeldekort = ({ readOnly, submit, isLoading }: Props) => {
  const { form, formFields } = useConfigForm<PliktkortFormFields>(
    {
      innsendtDato: {
        type: 'date_input',
        label: 'Dato for innsendt meldekort',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => submit('MELDEKORT', mapTilPliktkortKontrakt(data), null))(event);
  };
  return (
    <VilkårsKort heading={'Meldekort'}>
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.innsendtDato} />
        <MeldePerioder form={form} readOnly={readOnly} />
        <Button loading={isLoading} className={'fit-content'}>
          Neste
        </Button>
      </form>
    </VilkårsKort>
  );
};

DigitaliserMeldekort.displayName = 'DigitaliserMeldekort';
