'use client';

import { endOfWeek, format, getISOWeek, startOfWeek } from 'date-fns';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';

import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { OppsummeringTimer } from 'components/oppsummeringtimer/OppsummeringTimer';
import { UkeRad } from 'components/utfyllingkalender/ukerad/UkeRad';
import { VStack } from '@navikt/ds-react';

export type FieldArrayWithIndex = FieldArrayWithId<MeldepliktFormFields> & {
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
  const form = useFormContext<MeldepliktFormFields>();

  const { fields } = useFieldArray({
    control: form.control,
    name: 'dager',
  });

  const meldeperiodeUker: Record<string, MeldeperiodeUke> = fields.reduce(
    (acc, field, index) => {
      const ukeStart = format(startOfWeek(new Date(field.dag), { weekStartsOn: 1 }), 'yyyy-MM-dd');

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
    <VStack gap={'space-32'} id={utfyllingKalenderId}>
      {Object.entries(meldeperiodeUker).map(([ukeStart, felterIUken]) => (
        <UkeRad key={ukeStart} felterIUken={felterIUken} />
      ))}

      <OppsummeringTimer
        timer={form
          .watch('dager')
          .filter((value) => value.timer && Number(replaceCommasWithDots(value.timer)))
          .reduce((acc, curr) => acc + (curr.timer ? Number(replaceCommasWithDots(curr.timer)) : 0), 0)}
      />
    </VStack>
  );
};
