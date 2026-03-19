'use client';

import { MeldeperiodeUke } from 'components/utfyllingkalender/UtfyllingKalender';
import { eachDayOfInterval } from 'date-fns';

import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';

import styles from 'components/utfyllingkalender/ukerad/UkeRad.module.css';

import { MeldepliktFormFields } from 'components/flyt/steg/utfylling/Utfylling';
import { useFormContext } from 'react-hook-form';
import { useSkjermBredde } from 'hooks/skjermbreddeHook';
import { UkeDag } from '../ukedag/UkeDag';

interface Props {
  felterIUken: MeldeperiodeUke;
}

export const UkeRad = ({ felterIUken }: Props) => {
  const form = useFormContext<MeldepliktFormFields>();
  const { erLitenSkjerm } = useSkjermBredde();

  const alleDagerIUken = eachDayOfInterval({
    start: new Date(felterIUken.ukeStart),
    end: new Date(felterIUken.ukeSlutt),
  });

  const felterMap = new Map(felterIUken.felter.map((field) => [field.dag, field]));

  const ukeUtfyllingErrors =
    form.formState.errors?.dager && Array.isArray(form.formState.errors.dager)
      ? form.formState.errors.dager
          .filter((dag) => dag?.timer)
          .map((dag) => ({
            ref: dag.timer.ref.name,
            message: dag.timer.message,
          }))
          .filter((error) => {
            // Henter ut index fra ref (dager.3.timer)
            const index = parseInt(error.ref.split('.')[1]);
            return Array.from(felterMap.values()).some((field) => field.index === index);
          })
      : [];

  const ukeUtfyllingErrorMeldinger = ukeUtfyllingErrors.map((error) => error.message);

  return (
    <div className={styles.rad}>
      <div className={styles.heading}>
        <Heading size={'medium'} level={'3'}>
          Uke {felterIUken.ukeNummer}
        </Heading>
      </div>
      <VStack>
        <div className={ukeUtfyllingErrorMeldinger.length > 0 ? styles.ukeradmederror : styles.ukerad}>
          {alleDagerIUken.map((dag, index) => {
            return (
              <UkeDag
                key={dag.toString()}
                dag={dag}
                felterMap={felterMap}
                erSisteFeltiRaden={alleDagerIUken.length === index + 1}
                radHarError={ukeUtfyllingErrorMeldinger.length > 0}
              />
            );
          })}
        </div>
        {!erLitenSkjerm && ukeUtfyllingErrors.length > 0 && (
          <Alert variant={'error'}>
            {ukeUtfyllingErrorMeldinger.map((error, index) => {
              return <BodyShort key={index}>{error}</BodyShort>;
            })}
          </Alert>
        )}
      </VStack>
    </div>
  );
};
