'use client';

import { MeldekortV0 } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { Button } from '@navikt/ds-react';
import { addWeeks, format, isBefore, startOfWeek, subMonths } from 'date-fns';
import { MeldeperioderV2 } from 'components/postmottak/digitaliserdokument/meldekort/MeldePerioderV2';
import { FormEvent } from 'react';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
}
export type Meldedag = {
  dato: Date;
  arbeidsTimer: string;
};
export type Meldeperiode = {
  dager: Meldedag[];
  ukestart: string; // hvis denne er Date funker ikke insert/append i fieldArray
};
export interface MeldekortFormFields {
  gjelderForUker: string[];
  innsendtDato: Date;
  meldeperioder: Meldeperiode[];
}

export const ukestartSisteHalvår = (): ValuePair[] => {
  const iDag = new Date();
  const sisteValgbareUke = addWeeks(iDag, 1);
  const seksMndSiden = subMonths(iDag, 6);

  let ukestarter: Date[] = [];
  let gjeldendeUke = seksMndSiden;
  while (isBefore(gjeldendeUke, sisteValgbareUke)) {
    ukestarter.push(startOfWeek(gjeldendeUke, { weekStartsOn: 1 }));
    gjeldendeUke = addWeeks(gjeldendeUke, 1);
  }

  const opts = ukestarter.reverse().map((ukestart) => ({
    label: format(ukestart, 'I - yyyy'),
    value: ukestart.toISOString(),
  }));
  return opts;
};

export const DigitaliserMeldekortV2 = ({ readOnly, submit, isLoading }: Props) => {
  const { form, formFields } = useConfigForm<MeldekortFormFields>(
    {
      gjelderForUker: {
        type: 'combobox_multiple',
        label: 'Hvilke uker gjelder meldekortet for?',
        options: ukestartSisteHalvår(),
        rules: { required: 'Du må velge hvilke uker meldekortet gjelder for' },
      },
      innsendtDato: {
        type: 'date',
        label: 'Dato for innsendt meldekort',
        rules: { required: 'Du må registrere når meldekortet ble innsendt' },
      },
      meldeperioder: {
        type: 'fieldArray',
        defaultValue: [],
      },
    },
    { readOnly }
  );

  function mapTilMeldekortKontrakt(data: MeldekortFormFields) {
    const dager: MeldekortV0['timerArbeidPerPeriode'] = (data.meldeperioder ?? [])
      .flatMap((uke) => uke.dager)
      .map(({ dato, arbeidsTimer }) => ({
        fraOgMedDato: dato.toISOString().slice(0, 10),
        tilOgMedDato: dato.toISOString().slice(0, 10),
        timerArbeid: Number(arbeidsTimer),
      }));

    const meldekort: MeldekortV0 = {
      meldingType: MeldekortV0,
      harDuArbeidet: dager.some((dag) => dag.timerArbeid > 0),
      timerArbeidPerPeriode: dager,
    };
    return JSON.stringify(meldekort);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => submit('MELDEKORT', mapTilMeldekortKontrakt(data), data.innsendtDato))(event);
  };

  return (
    <VilkårsKort heading={'Meldekort'}>
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.gjelderForUker} />
        <FormField form={form} formField={formFields.innsendtDato} />
        <MeldeperioderV2 form={form} readOnly={readOnly} />
        <Button loading={isLoading} className={'fit-content'}>
          Neste
        </Button>
      </form>
    </VilkårsKort>
  );
};

DigitaliserMeldekortV2.displayName = 'DigitaliserMeldekort';
