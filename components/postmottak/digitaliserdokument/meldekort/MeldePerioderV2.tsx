'use client';

import { InlineMessage, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { MeldekortFormFields } from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekortV2';
import { MeldePeriodeInputV2 } from 'components/postmottak/digitaliserdokument/meldekort/MeldePeriodeInputV2';
import { useEffect } from 'react';
import { addDays, addWeeks, eachDayOfInterval, getISOWeek, isAfter } from 'date-fns';

interface Props {
  form: UseFormReturn<MeldekortFormFields>;
  readOnly: boolean;
}
export const MeldeperioderV2 = ({ form, readOnly }: Props) => {
  const { fields, remove, insert } = useFieldArray({
    name: 'meldeperioder',
    control: form.control,
    rules: {
      minLength: { value: 2, message: 'En meldeperiode består av to uker' },
      validate: {
        antallMeldeperioder: (meldeperioder) => {
          return meldeperioder.length % 2 !== 0 ? 'Ugyldig antall meldeperioder' : undefined;
        },
        harValgtPåfølgendeUke: (meldeperioder) => {
          for (let i = 0; i < meldeperioder.length; i += 2) {
            if (getISOWeek(addWeeks(meldeperioder[i].ukestart, 1)) !== getISOWeek(meldeperioder[i + 1].ukestart)) {
              console.log(getISOWeek(meldeperioder[i].ukestart));
              console.log(getISOWeek(meldeperioder[i + 1].ukestart));
              return 'Det er ikke valgt korrekte meldeperioder';
            }
          }
          return undefined;
        },
      },
    },
  });

  const valgteUker = form.watch('gjelderForUker');
  useEffect(() => {
    // legger inn nye meldeperioder når det velges en uke
    const meldeperioder = form.getValues('meldeperioder');
    valgteUker?.map((valgtUke) => {
      if (!meldeperioder.some((mp) => getISOWeek(mp.ukestart) === getISOWeek(valgtUke))) {
        const periodestart = valgtUke; // egentlig ukestart
        const periodeslutt = addDays(valgtUke, 6);
        const meldedager = eachDayOfInterval({ start: periodestart, end: periodeslutt }).map((meldedag) => ({
          dato: meldedag,
          arbeidsTimer: '0',
        }));
        const posisjon = meldeperioder.findLastIndex((mp) => isAfter(valgtUke, mp.ukestart));
        const ukestarten = new Date(valgtUke);
        insert(posisjon + 1, { ukestart: ukestarten.toISOString(), dager: meldedager });
      }
    });
  }, [valgteUker, form, insert]);

  useEffect(() => {
    // sletter meldeperioder når man fjerner en valgt uke
    const meldeperioder = form.getValues('meldeperioder');
    const indexerSomSkalSlettes = meldeperioder
      .map((meldeperiode, index) => (!valgteUker.includes(meldeperiode.ukestart.toString()) ? index : null))
      .filter((index) => index !== null);

    if (indexerSomSkalSlettes) {
      remove(indexerSomSkalSlettes);
    }
  }, [valgteUker, form, remove]);

  return (
    <VStack gap={'3'}>
      {fields.map((meldeperioder, periodeIndex) => (
        <MeldePeriodeInputV2 key={meldeperioder.id} form={form} dagIndex={periodeIndex} readOnly={readOnly} />
      ))}
      {form.formState.errors.meldeperioder && (
        <InlineMessage status="error">{form.formState.errors.meldeperioder.root?.message}</InlineMessage>
      )}
    </VStack>
  );
};
