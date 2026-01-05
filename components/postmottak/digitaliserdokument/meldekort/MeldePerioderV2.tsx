'use client';

import { InlineMessage, VStack } from '@navikt/ds-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { MeldekortFormFields } from 'components/postmottak/digitaliserdokument/meldekort/DigitaliserMeldekortV2';
import { MeldePeriodeInputV2 } from 'components/postmottak/digitaliserdokument/meldekort/MeldePeriodeInputV2';
import { parse, addDays, eachDayOfInterval } from 'date-fns';
import { useEffect } from 'react';

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
            if (meldeperioder[i].ukenummer + 1 !== meldeperioder[i + 1].ukenummer) {
              return 'Det er ikke valgt korrekte meldeperioder';
            }
          }
          return undefined;
        },
        harSammeUkeTakt: (meldeperioder) => {
          if (meldeperioder.length >= 1) {
            const førstePeriodeTakt = meldeperioder[0].ukenummer % 2;
            for (let i = 0; i < meldeperioder.length; i += 2) {
              if (meldeperioder[i].ukenummer % 2 !== førstePeriodeTakt) {
                return 'Det er avvik i når meldeperiodene starter. Meldeperiodene starter enten i partallsuker eller oddetallsuker';
              }
            }
            return undefined;
          }
        },
      },
    },
  });

  const valgteUker = form.watch('gjelderForUker');

  useEffect(() => {
    // legger inn nye meldeperioder når det velges en uke
    const meldeperioder = form.getValues('meldeperioder');
    valgteUker?.map((ukenummer) => {
      if (!meldeperioder.some((mp) => mp.ukenummer === Number(ukenummer))) {
        const periodestart = parse(ukenummer, 'I', new Date());
        const periodeslutt = addDays(periodestart, 6);
        const meldedager = eachDayOfInterval({ start: periodestart, end: periodeslutt }).map((meldedag) => ({
          dato: meldedag,
          arbeidsTimer: '0',
        }));
        let posisjon = meldeperioder.findLastIndex((meldeperiode) => Number(ukenummer) > meldeperiode.ukenummer);
        insert(posisjon + 1, { ukenummer: Number(ukenummer), dager: meldedager });
      }
    });
  }, [valgteUker, form, insert]);

  useEffect(() => {
    // sletter meldeperioder når man fjerner en valgt uke
    const indexes = form
      .getValues('meldeperioder')
      .map((meldeperiode, index) => (!valgteUker.includes(meldeperiode.ukenummer.toString()) ? index : null))
      .filter((index) => index !== null);
    if (indexes) {
      remove(indexes);
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
