import React, { useState } from 'react';
import { isAfter } from 'date-fns';

import { Button, Heading } from '@navikt/ds-react';
import { PlusIcon, QuestionmarkDiamondIcon } from '@navikt/aksel-icons';

import styles from 'components/barn/Barn.module.css';
import { Veiledning } from 'components/veiledning/Veiledning';
import { FormField, useConfigForm } from '@navikt/aap-felles-react';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { OppgitteBarn } from 'lib/types/types';

interface FormFields {
  begrunnelse: string;
  skalDetBeregnesBarneTillegg: string;
  forsørgerAnsvarStartDato: Date;
  forsørgerAnsvarSluttDato?: Date;
}

interface Props {
  manueltBarn: OppgitteBarn;
  readOnly: boolean;
}

export const ManueltBarn = ({ manueltBarn, readOnly }: Props) => {
  const [leggTilSluttDato, setLeggTilSluttDato] = useState(false);
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-20 og om det skal beregnes barnetillegg for dette barnet',
        rules: { required: 'Du må gi en begrunnelse' },
      },
      skalDetBeregnesBarneTillegg: {
        type: 'radio',
        label: 'Skal det beregnes barnetillegg for dette barnet?',
        options: JaEllerNeiOptions,
        rules: { required: 'Du må besvare om det skal beregnes barnetillegg for barnet' },
      },
      forsørgerAnsvarStartDato: {
        type: 'date',
        label: 'Søker har forsørgeransvar for barnet fra',
        toDate: new Date(),
        rules: {
          required: 'Du må sette en dato for når søker har forsørgeransvar for barnet fra',
          validate: (value) => {
            const inputDato = parseDatoFraDatePicker(value);
            if (inputDato) {
              return isAfter(inputDato, new Date())
                ? 'Dato for når søker har forsørgeransvar fra kan ikke være frem i tid'
                : true;
            }
            return 'Dato for når søker har forsørgeransvar fra er ikke gyldig';
          },
        },
      },
      forsørgerAnsvarSluttDato: {
        type: 'date',
        label: 'Sluttdato for forsørgeransvaret',
        rules: { required: 'Du må sette en dato for når søker har forsørgeransvar for barnet fra' },
      },
    },
    { readOnly: readOnly }
  );

  return (
    <section className={styles.barnekort}>
      <div className={styles.manueltbarnheading}>
        <div>
          <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
        </div>
        <div>
          <Heading size={'small'}>{manueltBarn.identifikator}</Heading>
        </div>
      </div>
      <div className={'flex-column'}>
        <Veiledning
          header={'Slik vurderes vilkåret'}
          defaultOpen={true}
          tekst={'Her kommer det en tekst om hvordan vilkåret skal vurderes'}
        />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.skalDetBeregnesBarneTillegg} />
        {form.watch('skalDetBeregnesBarneTillegg') === JaEllerNei.Ja && (
          <div className={'flex-row'}>
            <FormField form={form} formField={formFields.forsørgerAnsvarStartDato} />
            {leggTilSluttDato ? (
              <FormField form={form} formField={formFields.forsørgerAnsvarSluttDato} />
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setLeggTilSluttDato(true);
                }}
                icon={<PlusIcon />}
                className={'fit-content-button'}
                variant={'tertiary'}
                size={'medium'}
              >
                Legg til sluttdato
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
