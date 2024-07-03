import React, { useState } from 'react';
import { isAfter } from 'date-fns';

import { BodyShort, Button, ExpansionCard, Heading } from '@navikt/ds-react';
import { PlusIcon, QuestionmarkDiamondIcon } from '@navikt/aksel-icons';

import styles from 'components/barn/Barn.module.css';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { parseDatoFraDatePicker } from 'lib/utils/date';

export interface ManueltBarnType {
  navn: string;
  ident: string;
  rolle: 'FOSTERBARN' | 'ADOPTIVBARN';
}

interface FormFields {
  begrunnelse: string;
  skalDetBeregnesBarneTillegg: string;
  forsørgerAnsvarStartDato: Date;
  forsørgerAnsvarSluttDato?: Date;
}

interface Props {
  manueltBarn: ManueltBarnType;
}

export const ManueltBarn = ({ manueltBarn }: Props) => {
  const [leggTilSluttDato, setLeggTilSluttDato] = useState(false);
  const { formFields, form } = useConfigForm<FormFields>({
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
  });

  return (
    <ExpansionCard aria-label={'manuelt-barn'} size={'small'} defaultOpen={true} className={styles.barn}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          <div className={styles.manueltbarnheading}>
            <div>
              <QuestionmarkDiamondIcon title="manuelt barn ikon" fontSize={'3rem'} />
            </div>
            <div>
              <Heading size={'small'}>
                {manueltBarn.navn} - {manueltBarn.ident}
              </Heading>
              <BodyShort size={'small'}>Fosterbarn</BodyShort>
            </div>
          </div>
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <div className={'flex-column'}>
          <Veiledning
            header={'Slik vurderes vilkåret'}
            defaultOpen={true}
            tekst={'Her kommer det en tekst om hvordan vilkåret skal vurderes'}
          />
          <form className={'flex-column'} onSubmit={form.handleSubmit(() => console.log('Her skal det skje noe!'))}>
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
            <Button className={'fit-content-button'} variant={'secondary'} size={'medium'}>
              Lagre vurdering
            </Button>
          </form>
        </div>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
