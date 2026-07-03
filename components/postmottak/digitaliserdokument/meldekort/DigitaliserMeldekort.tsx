'use client';

import { MeldekortV0 } from 'lib/types/types';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { Button } from '@navikt/ds-react';
import { addWeeks, format, getISOWeek, isBefore, lastDayOfISOWeek, startOfWeek, subMonths } from 'date-fns';
import { SubmitEventHandler, useEffect, useState } from 'react';
import { Dato } from 'lib/types/Dato';
import { Alert } from 'components/alert/Alert';
import { clientHentHarRegistrertTimerIMeldeperioden } from 'lib/clientApi';
import { isError } from 'lib/utils/api';
import { Oppgave } from 'lib/types/oppgaveTypes';
import { Meldeperioder } from 'components/postmottak/digitaliserdokument/meldekort/MeldePerioder';

interface Props extends Submittable {
  readOnly: boolean;
  isLoading: boolean;
  oppgave: Oppgave;
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
  timerErAlleredeRegistrertIKelvin: string[];
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

export const DigitaliserMeldekort = ({ readOnly, submit, isLoading, oppgave }: Props) => {
  const [finnesTimerForMeldeperiode, setFinnesTimerForMeldeperiode] = useState<boolean>();

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
      timerErAlleredeRegistrertIKelvin: {
        type: 'checkbox',
        options: [{ value: 'timerErRegistrert', label: 'Timer er allerede registrert i kelvin' }],
      },
    },
    { readOnly }
  );

  function mapTilMeldekortKontrakt(data: MeldekortFormFields) {
    const dager: MeldekortV0['timerArbeidPerPeriode'] = (data.meldeperioder ?? [])
      .flatMap((uke) => uke.dager)
      .map(({ dato, arbeidsTimer }) => ({
        fraOgMedDato: new Dato(dato).formaterForBackend(),
        tilOgMedDato: new Dato(dato).formaterForBackend(),
        timerArbeid: Number(arbeidsTimer),
      }));

    const meldekort: MeldekortV0 = {
      meldingType: MeldekortV0,
      harDuArbeidet: dager.some((dag) => dag.timerArbeid > 0),
      timerArbeidPerPeriode: data.timerErAlleredeRegistrertIKelvin?.includes('timerErRegistrert') ? [] : dager,
    };
    return JSON.stringify(meldekort);
  }

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => submit('MELDEKORT', mapTilMeldekortKontrakt(data), data.innsendtDato))(event);
  };

  const meldeperioder = form.watch('meldeperioder');

  useEffect(() => {
    const erGyldigMeldeperiode =
      meldeperioder.length === 2 &&
      getISOWeek(addWeeks(meldeperioder[0].ukestart, 1)) === getISOWeek(meldeperioder[1].ukestart);

    if (!erGyldigMeldeperiode || !oppgave.saksnummer) {
      setFinnesTimerForMeldeperiode(undefined);
      return;
    }

    let avbrutt = false;

    const hentHarRegistrerteTimer = async () => {
      const meldeperiodeFom = new Date(meldeperioder[0].ukestart);
      const meldeperiodeTom = lastDayOfISOWeek(new Date(meldeperioder[1].ukestart));

      const respons = await clientHentHarRegistrertTimerIMeldeperioden(
        oppgave.saksnummer!,
        meldeperiodeFom,
        meldeperiodeTom
      );

      if (!avbrutt && !isError(respons)) {
        setFinnesTimerForMeldeperiode(respons.data.harRegistrertTimerForMeldeperioden);
      }
    };

    hentHarRegistrerteTimer();

    return () => {
      avbrutt = true;
    };
  }, [meldeperioder, oppgave.saksnummer]);

  const timerErRegistrertIKelvin = form.watch('timerErAlleredeRegistrertIKelvin')?.includes('timerErRegistrert');

  return (
    <VilkårsKort heading={'Meldekort'}>
      <form onSubmit={handleSubmit}>
        <FormField form={form} formField={formFields.gjelderForUker} />
        <FormField form={form} formField={formFields.innsendtDato} />
        <FormField form={form} formField={formFields.timerErAlleredeRegistrertIKelvin} />
        {!timerErRegistrertIKelvin && <Meldeperioder form={form} readOnly={readOnly} />}

        {finnesTimerForMeldeperiode && (
          <Alert variant={'info'}>Det er allerede ført timer for denne meldeperioden.</Alert>
        )}

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
