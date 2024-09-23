import { Button, Table } from '@navikt/ds-react';
import { FritakMeldepliktFormFields, MeldepliktPeriode } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { JaEllerNei } from 'lib/utils/form';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';

import styles from './Periodetabell.module.css';
import { SelectWrapper, TextFieldWrapper } from '@navikt/aap-felles-react';
import { UseFormReturn } from 'react-hook-form';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  perioder: MeldepliktPeriode[];
  vurderingstidspunkt?: string;
  readOnly: boolean;
  form: UseFormReturn<FritakMeldepliktFormFields>;
  remove: (index: number) => void;
}

export const Periodetabell = ({ perioder, vurderingstidspunkt, readOnly, form, remove }: Props) => {
  return (
    <Table className={styles.periodetabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Fritak meldeplikt</Table.HeaderCell>
          <Table.HeaderCell>Gjelder fra (dd.mm.åååå)</Table.HeaderCell>
          <Table.HeaderCell>Til og med (dd.mm.åååå)</Table.HeaderCell>
          <Table.HeaderCell>Dato vurdert</Table.HeaderCell>
          <Table.HeaderCell>Handling</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {perioder.map((periode, index) => (
          <Table.Row key={index}>
            <Table.DataCell>
              <SelectWrapper
                label={'Fritak meldeplikt'}
                hideLabel
                control={form.control}
                name={`fritaksvurdering.${index}.fritakFraMeldeplikt`}
                rules={{ required: 'Du må ta stilling til om bruker skal ha fritak fra meldeplikten eller ikke' }}
              >
                <option>-</option>
                <option value={JaEllerNei.Ja}>Ja</option>
                <option value={JaEllerNei.Nei}>Nei</option>
              </SelectWrapper>
            </Table.DataCell>
            <Table.DataCell>
              <TextFieldWrapper
                type={'text'}
                label={'Gjelder fra'}
                hideLabel
                control={form.control}
                name={`fritaksvurdering.${index}.fom`}
                rules={{
                  required: 'Du må legge inn en dato for når perioden starter',
                  validate: (value) => validerDato(value as string),
                }}
              />
            </Table.DataCell>
            <Table.DataCell>
              {form.watch(`fritaksvurdering.${index}.fritakFraMeldeplikt`) === JaEllerNei.Ja && (
                <TextFieldWrapper
                  type={'text'}
                  label={'Til og med'}
                  hideLabel
                  control={form.control}
                  name={`fritaksvurdering.${index}.tom`}
                  rules={{
                    required: 'Du må legge inn en dato for når perioden slutter',
                    validate: {
                      gyldigDato: (value) => validerDato(value as string),
                      ikkeFoerStart: (value) => {
                        if (form.watch(`fritaksvurdering.${index}.fritakFraMeldeplikt`) === JaEllerNei.Ja) {
                          if (erDatoFoerDato(value as string, form.getValues(`fritaksvurdering.${index}.fom`))) {
                            return 'Slutt-dato kan ikke være før start-dato';
                          }
                        }
                      },
                    },
                  }}
                />
              )}
            </Table.DataCell>
            <Table.DataCell>{vurderingstidspunkt && formaterDatoForVisning(vurderingstidspunkt)}</Table.DataCell>
            <Table.DataCell>
              {perioder.length > 1 && !readOnly && (
                <Button type={'button'} onClick={() => remove(index)}>
                  Slett
                </Button>
              )}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

function validerDato(value?: string) {
  if (!value) {
    return 'Du må sette en dato';
  }
  const inputDato = parseDatoFraDatePicker(value);
  if (!inputDato) {
    return 'Dato format er ikke gyldig. Dato må være på formatet dd.mm.yyyy';
  }
}

function erDatoFoerDato(inputDato: string, referanseDato: string): boolean {
  return (
    new Date(parse(inputDato as string, 'dd.MM.yyyy', new Date())) <
    new Date(parse(referanseDato, 'dd.MM.yyyy', new Date()))
  );
}
