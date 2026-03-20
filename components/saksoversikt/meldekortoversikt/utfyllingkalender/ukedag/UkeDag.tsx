import { BodyShort, Detail, VStack } from '@navikt/ds-react';

import { format } from 'date-fns';

import styles from './UkeDag.module.css';

import { nb } from 'date-fns/locale';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { FieldArrayWithIndex } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import {
  formaterDatoMedMånedIBokstaver,
  formaterDatoUtenÅrForFrontend,
  fullDag,
} from 'components/saksoversikt/meldekortoversikt/utfyllingDate';
import { useFormContext } from 'react-hook-form';
import { RedigerMeldekortFormFields } from 'components/saksoversikt/meldekortoversikt/redigermeldekortmodal/RedigerMeldekortModal';
import { replaceCommasWithDots } from 'lib/utils/string';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  dag: Date;
  felterMap: Map<string, FieldArrayWithIndex>;
  erSisteFeltiRaden: boolean;
  radHarError: boolean;
}

export const UkeDag = ({ dag, felterMap, erSisteFeltiRaden, radHarError }: Props) => {
  const form = useFormContext<RedigerMeldekortFormFields>();
  const dagStr = format(dag, 'yyyy-MM-dd');
  const eksisterendeFelt = felterMap.get(dagStr);

  const errorList = hentFeilmeldingerForForm(form.formState.errors);
  console.log('Såå hva er denne?', errorList);

  const harFeilmelding =
    eksisterendeFelt?.index !== undefined
      ? form.formState.errors?.dager?.[eksisterendeFelt.index]?.timerArbeidet
      : undefined;

  if (!eksisterendeFelt) {
    return null;
  }

  const harVerdi = form.watch(`dager.${eksisterendeFelt.index}.timerArbeidet`);

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
          <VStack gap={'2'}>
            <VStack>
              <Detail>{formaterDatoUtenÅrForFrontend(dag)}</Detail>
              <BodyShort size={'small'} weight={'semibold'}>
                {formaterUkedag(dag)}
              </BodyShort>
            </VStack>
            {eksisterendeFelt && (
              <TextFieldWrapper
                type={'text'}
                control={form.control}
                id={`dager${eksisterendeFelt.index}timerArbeidet`}
                name={`dager.${eksisterendeFelt.index}.timerArbeidet`}
                label={`Arbeid for ${fullDag(eksisterendeFelt.dato)} ${formaterDatoMedMånedIBokstaver(eksisterendeFelt.dato)}`}
                className={`${styles.tekstfelt} ${harFeilmelding ? 'navds-text-field--error' : ''}`}
                hideLabel
                hideErrorMessage
                rules={{
                  validate: (value) => {
                    if (!value || value === '') {
                      return true;
                    }

                    const valueAsNumber = Number(replaceCommasWithDots(value as string));

                    if (isNaN(valueAsNumber)) {
                      return `Vennligst skriv inn et gyldig tall ${formaterDatoForFrontend(dag)}`;
                    } else if (valueAsNumber < 0 || valueAsNumber > 24) {
                      return `Tallet må være mellom 0 og 24 ${formaterDatoForFrontend(dag)}`;
                    } else if ((valueAsNumber * 10) % 5 !== 0) {
                      return `Du kan bare skrive inn hele eller halve timer ${formaterDatoForFrontend(dag)}`;
                    }
                  },
                }}
              />
            )}
          </VStack>
        </div>
      </div>
    </div>
  );

  function formaterUkedag(date: string | Date): string {
    const dato = new Date(date);
    const ukedag = format(dato, 'EEEE', { locale: nb });

    return ukedag.substring(0, 2) + '.';
  }
};
