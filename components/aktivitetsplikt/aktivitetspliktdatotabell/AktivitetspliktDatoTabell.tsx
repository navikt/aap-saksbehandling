import { Button, Table } from '@navikt/ds-react';

import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { TrashIcon } from '@navikt/aksel-icons';
import { DateInputWrapper } from '@navikt/aap-felles-react';
import { AktivitetspliktFormFields } from 'components/aktivitetsplikt/Aktivitetsplikt';

import styles from 'components/aktivitetsplikt/aktivitetspliktdatotabell/AktivitetspliktDatoTabell.module.css';
import { validerDato } from 'lib/validation/dateValidation';
import { isBefore, parse, startOfDay } from 'date-fns';

interface Props {
  form: UseFormReturn<AktivitetspliktFormFields>;
  fields: FieldArrayWithId<AktivitetspliktFormFields, 'perioder'>[];
  remove: UseFieldArrayRemove;
  søknadstidspunkt: Date;
}

export const AktivitetspliktDatoTabell = ({ form, fields, remove, søknadstidspunkt }: Props) => {
  return (
    <>
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
                  Slett
                </Button>
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
