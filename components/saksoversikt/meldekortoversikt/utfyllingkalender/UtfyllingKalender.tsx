'use client';

import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import { VStack } from '@navikt/ds-react';
import { RedigerMeldekortFormFields } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { UkeRad } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/ukerad/UkeRad';
import { replaceCommasWithDots } from 'lib/utils/string';
import { OppsummeringTimer } from 'components/saksoversikt/meldekortoversikt/oppsummeringtimer/OppsummeringTimer';

export type FieldArrayWithIndex = FieldArrayWithId<RedigerMeldekortFormFields> & {
  index: number;
};

export interface MeldeperiodeUke {
  ukeStart: Date;
  ukeSlutt: Date;
  ukeNummer: number;
  felter: FieldArrayWithIndex[];
}

export const utfyllingKalenderId = 'rapporteringskalender';

export const UtfyllingKalender = () => {
  const form = useFormContext<RedigerMeldekortFormFields>();
  const { fields } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  const meldeperiodeUker: Record<string, MeldeperiodeUke> = fields.reduce(
    (acc, field, index) => {
      const ukeStart = format(startOfWeek(new Date(field.dato), { weekStartsOn: 1 }), 'yyyy-MM-dd');

      if (!acc[ukeStart]) {
        const parsedUkeStart = new Date(ukeStart);
        acc[ukeStart] = {
          felter: [],
          ukeStart: parsedUkeStart,
          ukeSlutt: endOfWeek(parsedUkeStart, { weekStartsOn: 1 }),
          ukeNummer: getISOWeek(parsedUkeStart),
        };
      }

      acc[ukeStart].felter.push({ ...field, index });

      return acc;
    },
    {} as Record<string, MeldeperiodeUke>
  );

  return (
    <VStack gap={'4'} id={utfyllingKalenderId}>
      {Object.entries(meldeperiodeUker).map(([ukeStart, felterIUken]) => (
        <UkeRad key={ukeStart} felterIUken={felterIUken} />
      ))}

      <OppsummeringTimer
        timer={form
          .watch('dager')
          .filter((value) => value.timerArbeidet && Number(replaceCommasWithDots(value.timerArbeidet)))
          .reduce((acc, curr) => acc + (curr.timerArbeidet ? Number(replaceCommasWithDots(curr.timerArbeidet)) : 0), 0)}
      />
    </VStack>
  );
};
