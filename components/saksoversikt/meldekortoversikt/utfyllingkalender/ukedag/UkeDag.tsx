import { BodyShort, Detail, VStack } from '@navikt/ds-react';

import { MeldepliktFormFields, replaceCommasWithDots } from 'components/flyt/steg/utfylling/Utfylling';
import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';

import styles from './UkeDag.module.css';
import { formaterDatoMedMånedIBokstaver, formaterDatoUtenÅrForFrontend, fullDag } from 'lib/utils/date';
import { nb } from 'date-fns/locale';
import { storForbokstav } from 'lib/utils/string';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  dag: Date;
  felterMap: Map<string, FieldArrayWithIndex>;
  erSisteFeltiRaden: boolean;
  radHarError: boolean;
}

export const UkeDag = ({ dag, felterMap, erSisteFeltiRaden, radHarError }: Props) => {
  const dagStr = format(dag, 'yyyy-MM-dd');
  const dagINummer = formaterDatoUtenÅrForFrontend(dag);
  const eksisterendeFelt = felterMap.get(dagStr);
  const harFeilmelding =
    eksisterendeFelt?.index !== undefined ? form.formState.errors?.dager?.[eksisterendeFelt.index]?.timer : undefined;

  if (erLitenSkjerm && !eksisterendeFelt) {
    return null;
  }

  const harVerdi = form.watch(`dager.${eksisterendeFelt?.index!}.timer`);

  const containerClassNames = [
    !eksisterendeFelt && styles.ikkeeksisterendefelt,
    harVerdi && styles.erutfylt,
    harFeilmelding && styles.harFeilmelding,
    radHarError ? styles.dagcontainerharerror : styles.dagcontainer,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassNames}>
      <div className={erSisteFeltiRaden ? styles.inputwrapperutenborder : styles.inputwrapper}>
        <div className={styles.dag}>
          <div className={styles.timerinput}>
            <VStack>
              <Detail>
                {erLitenSkjerm ? formaterDatoMedMånedIBokstaver(dag) : formaterDatoUtenÅrForFrontend(dag)}
              </Detail>
              <BodyShort size={'medium'} weight={'semibold'}>
                {erLitenSkjerm ? storForbokstav(formaterUkedag(dag)) : formaterUkedag(dag)}
              </BodyShort>
            </VStack>
            {eksisterendeFelt && (
              <TextFieldWrapper
                type={'number'}
                control={form.control}
                id={`dager${eksisterendeFelt.index}timer`}
                name={`dager.${eksisterendeFelt.index}.timer`}
                label={`Arbeid for ${fullDag(eksisterendeFelt.dag)} ${formaterDatoMedMånedIBokstaver(eksisterendeFelt.dag)}`}
                className={`${styles.tekstfelt} ${harFeilmelding ? 'navds-text-field--error' : ''}`}
                rules={{
                  validate: (value) => {
                    if (!value || value === '') {
                      return true;
                    }

                    const valueAsNumber = Number(replaceCommasWithDots(value as string));

                    if (isNaN(valueAsNumber) || valueAsNumber < 0 || valueAsNumber > 24) {
                      return 'Noe tekst';
                    } else if ((valueAsNumber * 10) % 5 !== 0) {
                      return 'Noe tekst';
                    }
                  },
                }}
              />
            )}
          </div>
          {harFeilmelding && erLitenSkjerm && (
            <div className={styles.error}>
              <XMarkOctagonFillIcon className={styles.errorIcon} fontSize={'2rem'} />
              <BodyShort size={'small'}>{harFeilmelding.message}</BodyShort>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function formaterUkedag(date: string | Date): string {
    const dato = new Date(date);
    const ukedag = format(dato, 'EEEE', { locale: nb });

    return erLitenSkjerm ? ukedag : ukedag.substring(0, 2) + '.';
  }
};
