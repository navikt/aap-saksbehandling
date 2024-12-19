import { Alert, BodyShort, Button, Label, Table } from '@navikt/ds-react';

import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from '@navikt/aap-felles-react';

import styles from 'components/aktivitetsplikt/aktivitetspliktdato/AktivitetspliktDato.module.css';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, parse, startOfDay } from 'date-fns';
import { AktivitetspliktFormFields } from '../aktivitetspliktform/AktivitetspliktForm';
import { hentDatoLabel } from 'components/aktivitetsplikt/util/AktivitetspliktUtil';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  form: UseFormReturn<AktivitetspliktFormFields>;
  fields: FieldArrayWithId<AktivitetspliktFormFields, 'perioder'>[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<AktivitetspliktFormFields, 'perioder'>;
  søknadstidspunkt: Date;
  errorMessage?: string;
}

export const AktivitetspliktDato = ({ form, fields, remove, søknadstidspunkt, append, errorMessage }: Props) => {
  const erMuligÅLeggeTilPeriode =
    form.watch('brudd') !== 'IKKE_MØTT_TIL_MØTE' && form.watch('brudd') !== 'IKKE_SENDT_INN_DOKUMENTASJON';

  return (
    <div className={'flex-column'}>
      <div>
        <Label size={'small'}>{hentDatoLabel(form.watch('brudd'))}</Label>
        <BodyShort size={'small'}>Søknadstidspunkt: {formaterDatoForFrontend(søknadstidspunkt)}</BodyShort>
      </div>
      <Table size={'small'}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textSize={'small'}>Dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Til og med dato</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Type</Table.HeaderCell>
            <Table.HeaderCell textSize={'small'}>Handling</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fields.map((field, index) => (
            <Table.Row key={field.id}>
              <Table.DataCell className={'navds-table__data-cell--align-top'}>
                <div className={styles.tekstfelt}>
                  <DateInputWrapper
                    label={field.type === 'enkeltdag' ? 'dato' : 'fra og med dato'}
                    hideLabel={true}
                    control={form.control}
                    name={field.type === 'enkeltdag' ? `perioder.${index}.dato` : `perioder.${index}.fom`}
                    rules={{
                      validate: (value) => {
                        const valideringsresultat = validerDato(value as string);
                        if (valideringsresultat) {
                          return valideringsresultat;
                        }

                        const bruddDate = startOfDay(parse(value as string, 'dd.MM.yyyy', new Date()));
                        const søknadsTidspunktStartOfDay = startOfDay(søknadstidspunkt);

                        if (isBefore(bruddDate, søknadsTidspunktStartOfDay)) {
                          return 'Bruddperioden kan ikke starte før søknadstidspunktet';
                        }
                      },
                    }}
                  />
                </div>
              </Table.DataCell>
              {field.type === 'periode' ? (
                <Table.DataCell>
                  <div className={styles.tekstfelt}>
                    <DateInputWrapper
                      label={'til og med dato'}
                      control={form.control}
                      hideLabel={true}
                      name={`perioder.${index}.tom`}
                      rules={{ validate: (value) => validerDato(value as string) }}
                    />
                  </div>
                </Table.DataCell>
              ) : (
                <Table.DataCell />
              )}
              <Table.DataCell>{field.type === 'periode' ? 'Periode' : 'Enkeltdato'}</Table.DataCell>
              <Table.DataCell>
                <Button
                  type={'button'}
                  size={'small'}
                  variant={'tertiary'}
                  icon={<TrashIcon />}
                  onClick={() => remove(index)}
                >
                  {`Fjern ${field.type === 'periode' ? 'periode' : 'enkeltdato'}`}
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className={'flex-row'}>
        <Button
          icon={<PlusCircleIcon />}
          type={'button'}
          variant={'tertiary'}
          size={'small'}
          onClick={() => append({ type: 'enkeltdag', dato: '' })}
        >
          Legg til enkeltdato
        </Button>
        {erMuligÅLeggeTilPeriode && (
          <Button
            icon={<PlusCircleIcon />}
            type={'button'}
            variant={'tertiary'}
            size={'small'}
            onClick={() => append({ type: 'periode', fom: '', tom: '' })}
          >
            Legg til periode
          </Button>
        )}
      </div>
      {errorMessage && <Alert variant={'error'}>{errorMessage}</Alert>}
    </div>
  );
};
