import { Dato } from 'lib/types/Dato';
import { eachDayOfInterval, format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { formaterDatoUtenÅrForFrontend } from 'components/saksoversikt/meldekortoversikt/utfyllingDate';
import { BodyShort, Detail, HStack, VStack } from '@navikt/ds-react';

import styles from './FørteTimer.module.css';
import { MeldeperiodeMedMeldekortDto } from 'lib/types/types';

interface Props {
  meldekort: MeldeperiodeMedMeldekortDto;
}

export const FørteTimer = ({ meldekort }: Props) => {
  const alleDagerIMeldeperioden = eachDayOfInterval({
    start: new Dato(meldekort.meldeperiode.fom).dato,
    end: new Dato(meldekort.meldeperiode.tom).dato,
  });

  const dagerMedTimer = alleDagerIMeldeperioden.map((dato) => {
    const dagFraBackend = meldekort.meldekort?.dager.find((dag) => dag.dato === format(dato, 'yyyy-MM-dd'));
    return {
      dato,
      timerArbeidet: dagFraBackend?.timerArbeidet,
    };
  });

  const uker = [dagerMedTimer.slice(0, 7), dagerMedTimer.slice(7, 14)];

  return (
    <VStack gap={'4'}>
      {uker.map((uke, ukeIndex) => (
        <HStack key={ukeIndex}>
          {uke.map((dag, index) => {
            const dato = formaterDatoMeddag(dag.dato);
            const harVerdi = dag.timerArbeidet && dag.timerArbeidet > 0;
            const erSisteDagIUken = uke.length === index + 1;

            const containerClassNames = [!erSisteDagIUken && styles.border, harVerdi && styles.erutfylt, styles.dag]
              .filter(Boolean)
              .join(' ');

            return (
              <VStack key={index} className={containerClassNames} gap={'2'} align={'start'}>
                <Detail>{dato}</Detail>
                <BodyShort size={'small'}>{dag.timerArbeidet}</BodyShort>
              </VStack>
            );
          })}
        </HStack>
      ))}
    </VStack>
  );
};

function formaterDatoMeddag(dato: Date): string {
  return `${formaterUkedag(dato)} ${formaterDatoUtenÅrForFrontend(dato)}`;
}

function formaterUkedag(date: string | Date): string {
  const dato = new Date(date);
  const ukedag = format(dato, 'EEEE', { locale: nb });

  return ukedag.substring(0, 3) + '.';
}
