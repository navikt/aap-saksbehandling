'use client';

import { eachDayOfInterval } from 'date-fns';

import { BodyShort, Heading, VStack } from '@navikt/ds-react';

import styles from './UkeRad.module.css';

import { useFormContext } from 'react-hook-form';

import { UkeDag } from '../ukedag/UkeDag';
import { MeldeperiodeUke } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import { RedigerMeldekortFormFields } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';

interface Props {
  felterIUken: MeldeperiodeUke;
}

export const UkeRad = ({ felterIUken }: Props) => {
  const form = useFormContext<RedigerMeldekortFormFields>();

  const alleDagerIUken = eachDayOfInterval({
    start: new Date(felterIUken.ukeStart),
    end: new Date(felterIUken.ukeSlutt),
  });

  const felterMap = new Map(felterIUken.felter.map((field) => [field.dato, field]));

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
    <VStack gap={'4'}>
      <BodyShort size={'medium'} weight={"semibold"}>Uke {felterIUken.ukeNummer}</BodyShort>

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
    </VStack>
  );
};
