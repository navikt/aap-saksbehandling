'use client';
import { Table, Timeline } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { TilkjentYtelseGrunnlag, TilkjentYtelsePeriode } from 'lib/types/types';
import { useState } from 'react';

interface Props {
  tilkjentYtelse: TilkjentYtelseGrunnlag;
}
export const PeriodeViser = ({ tilkjentYtelse }: Props) => {
  const [activePeriod, setActivePeriod] = useState<TilkjentYtelsePeriode>();
  return (
    <div>
      <Timeline>
        <Timeline.Row label="AAP" icon={<PersonIcon aria-hidden />}>
          {tilkjentYtelse?.perioder?.map((periode: TilkjentYtelsePeriode, i) => (
            <Timeline.Period
              key={i}
              start={new Date(periode?.periode?.fom)}
              end={new Date(periode?.periode?.tom)}
              status={'info'}
              icon={<PersonIcon />}
              statusLabel={'status status'}
              onSelectPeriod={() => setActivePeriod(periode)}
              // TODO: trenger en id fra backend på tilkjentytelse-periode
              // isActive={activePeriod.id === periode.id}
            />
          ))}
        </Timeline.Row>
        <Timeline.Zoom>
          <Timeline.Zoom.Button label="3 mnd" interval="month" count={3} />
          <Timeline.Zoom.Button label="9 mnd" interval="month" count={9} />
          <Timeline.Zoom.Button label="1.5 år" interval="year" count={1.5} />
          <Timeline.Zoom.Button label="3 år" interval="year" count={3} />
        </Timeline.Zoom>
      </Timeline>
      {activePeriod && (
        <Table zebraStripes>
          <Table.Body>
            <Table.Row>
              <Table.DataCell scope="row">{'Dagsats'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.dagsats && JSON.stringify(activePeriod.tilkjent.dagsats)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Grunnlag'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.grunnlag && JSON.stringify(activePeriod.tilkjent.grunnlag)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Gradering'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.gradering && JSON.stringify(activePeriod.tilkjent.gradering)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Antall barn'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.antallBarn && JSON.stringify(activePeriod.tilkjent.antallBarn)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Barnetillegg'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.barnetillegg && JSON.stringify(activePeriod.tilkjent.barnetillegg)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Barnetilleggsats'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.barnetilleggsats && JSON.stringify(activePeriod.tilkjent.barnetilleggsats)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Grunnbeløp'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.grunnbeløp && JSON.stringify(activePeriod.tilkjent.grunnbeløp)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell scope="row">{'Grunnlagsfaktor'}</Table.DataCell>
              <Table.DataCell>
                {activePeriod.tilkjent.grunnlagsfaktor && JSON.stringify(activePeriod.tilkjent.grunnlagsfaktor)}
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </div>
  );
};
