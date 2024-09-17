import { Button, Select, Table, TextField } from '@navikt/ds-react';
import { MeldepliktPeriode, Valideringsfeil } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { Dispatch, SetStateAction } from 'react';
import { JaEllerNei } from 'lib/utils/form';
import { formaterDatoForVisning } from '@navikt/aap-felles-utils-client';

import styles from './Periodetabell.module.css';

interface Props {
  perioder: MeldepliktPeriode[];
  oppdaterPerioder: Dispatch<SetStateAction<MeldepliktPeriode[]>>;
  vurderingstidspunkt?: string;
  valideringsfeil: Valideringsfeil[];
}

export const Periodetabell = ({ perioder, oppdaterPerioder, vurderingstidspunkt, valideringsfeil }: Props) => {
  const slettRad = (index: number) => {
    oppdaterPerioder((prevState) => [...prevState.toSpliced(index, 1)]);
  };

  const oppdater = (value: string, index: number, felt: keyof MeldepliktPeriode) => {
    oppdaterPerioder((prevState) => {
      const periodeSomSkalOppdateres = prevState[index];
      periodeSomSkalOppdateres[felt] = value;
      prevState[index] = periodeSomSkalOppdateres;
      return [...prevState];
    });
  };

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
              <Select
                label={'Fritak meldeplikt'}
                hideLabel
                onChange={(event) => oppdater(event.currentTarget.value, index, 'fritakFraMeldeplikt')}
                value={periode.fritakFraMeldeplikt ?? ''}
                error={
                  valideringsfeil.find((feil) => feil.felt === 'fritakFraMeldeplikt' && feil.index === index)?.message
                }
              >
                <option>-</option>
                <option value={JaEllerNei.Ja}>Ja</option>
                <option value={JaEllerNei.Nei}>Nei</option>
              </Select>
            </Table.DataCell>
            <Table.DataCell>
              <TextField
                label={'Gjelder fra'}
                hideLabel
                onChange={(event) => oppdater(event.currentTarget.value, index, 'fom')}
                value={periode.fom ?? ''}
                error={valideringsfeil.find((feil) => feil.felt === 'fom' && feil.index === index)?.message}
              />
            </Table.DataCell>
            <Table.DataCell>
              {periode.fritakFraMeldeplikt === JaEllerNei.Ja && (
                <TextField
                  label={'Til og med'}
                  hideLabel
                  onChange={(event) => oppdater(event.currentTarget.value, index, 'tom')}
                  value={periode.tom ?? ''}
                  error={valideringsfeil.find((feil) => feil.felt === 'tom' && feil.index === index)?.message}
                />
              )}
            </Table.DataCell>
            <Table.DataCell>{vurderingstidspunkt && formaterDatoForVisning(vurderingstidspunkt)}</Table.DataCell>
            <Table.DataCell>
              {perioder.length > 1 && (
                <Button type={'button'} onClick={() => slettRad(index)}>
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
