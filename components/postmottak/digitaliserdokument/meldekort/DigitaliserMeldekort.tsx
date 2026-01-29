'use client';

import { MeldePerioder } from './MeldePerioder';
import { MeldekortV0 } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { Button } from '@navikt/ds-react';
import { FormEvent } from 'react';
import { Dato } from 'lib/types/Dato';

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
  innsendtDato: Date;
  pliktPerioder?: PliktPeriode[];
}
export const DigitaliserMeldekort = ({ readOnly, submit, isLoading }: Props) => {
  const { form, formFields } = useConfigForm<PliktkortFormFields>(
    {
      innsendtDato: {
        type: 'date',
        label: 'Dato for innsendt meldekort',
        rules: { required: 'Du må registrere når meldekortet ble innsendt' },
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
        fraOgMedDato: new Dato(dato!).formaterForBackend(),
        tilOgMedDato: new Dato(dato!).formaterForBackend(),
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
    form.handleSubmit((data) => submit('MELDEKORT', mapTilPliktkortKontrakt(data), data.innsendtDato))(event);
  };
  return (
    <VilkårsKort heading={'Meldekort'}>
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.innsendtDato} />
        <MeldePerioder form={form} readOnly={readOnly} />

        {!readOnly && (
          <Button loading={isLoading} className={'fit-content'}>
            Neste
          </Button>
        )}
      </form>
    </VilkårsKort>
  );
};

DigitaliserMeldekort.displayName = 'DigitaliserMeldekort';
