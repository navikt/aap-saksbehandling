'use client';

import { Alert, Label, Table } from '@navikt/ds-react';
import { SimulertUtbetaling, UtbetalingOgSimuleringGrunnlag } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: UtbetalingOgSimuleringGrunnlag[];
}

const Utbetalingstabell = ({ utbetalinger }: { utbetalinger: SimulertUtbetaling[] }) => {
  return (
    <Table>
      <Table.Header>
        <Table.HeaderCell>Fagsystem</Table.HeaderCell>
        <Table.HeaderCell>Nytt beløp</Table.HeaderCell>
        <Table.HeaderCell>Tidligere utbetalt</Table.HeaderCell>
        <Table.HeaderCell>Differanse</Table.HeaderCell>
        <Table.HeaderCell>Utbetales til</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {utbetalinger.map((utbetaling, index) => (
          <Table.Row key={utbetaling.sakId + '::' + index}>
            <Table.DataCell>{utbetaling.fagsystem}</Table.DataCell>
            <Table.DataCell>{utbetaling.nyttBeløp}</Table.DataCell>
            <Table.DataCell>{utbetaling.tidligereUtbetalt}</Table.DataCell>
            <Table.DataCell>{utbetaling.nyttBeløp - utbetaling.tidligereUtbetalt}</Table.DataCell>
            <Table.DataCell>{utbetaling.utbetalesTil}</Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const UtbetalingOgSimulering = ({ grunnlag }: Props) => {
  if (!grunnlag.length) {
    return <Alert variant={'info'}>Ingenting å vise.</Alert>;
  }
  return (
    <div>
      {grunnlag.map((simulering) =>
        simulering.simuleringDto.perioder.map((simuleringsperiode, index) => (
          <section key={index}>
            <Label>
              {formaterDatoForFrontend(simuleringsperiode.fom)} - {formaterDatoForFrontend(simuleringsperiode.tom)}
            </Label>
            <Utbetalingstabell utbetalinger={simuleringsperiode.utbetalinger} />
          </section>
        ))
      )}
    </div>
  );
};
