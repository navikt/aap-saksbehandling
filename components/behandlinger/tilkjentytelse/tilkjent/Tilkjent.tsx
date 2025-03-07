'use client';

import { TilkjentYtelseGrunnlag } from 'lib/types/types';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { PiggybankIcon } from '@navikt/aksel-icons';
import { Detail, Label, Table } from '@navikt/ds-react';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  grunnlag: TilkjentYtelseGrunnlag;
}
export const Tilkjent = ({ grunnlag }: Props) => {
  return (
    <VilkårsKort heading="Tilkjent ytelse" icon={<PiggybankIcon aria-hidden />} steg="BEREGN_TILKJENT_YTELSE">
      <Label>Grafen viser tilkjent ytelse for valgt periode</Label>
      <Detail>Tilkjent ytelse frem i tid er et anslag som kan endre seg basert på gradering og andre faktorer</Detail>
      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Dagsats</Table.HeaderCell>
            <Table.HeaderCell>Gradering</Table.HeaderCell>
            <Table.HeaderCell>Grunnlag</Table.HeaderCell>
            <Table.HeaderCell>Grunnlagsfaktor</Table.HeaderCell>
            <Table.HeaderCell>Grunnbeløp</Table.HeaderCell>
            <Table.HeaderCell>Antall barn</Table.HeaderCell>
            <Table.HeaderCell>Barnetillegsats</Table.HeaderCell>
            <Table.HeaderCell>Barnetillegg</Table.HeaderCell>
            <Table.HeaderCell>Utbetalingsdato</Table.HeaderCell>
            <Table.HeaderCell>Redusert dagsats</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {grunnlag.perioder.map((periode) => (
            <Table.Row key={periode.fraOgMed}>
              <Table.DataCell>
                {formaterDatoForFrontend(periode.fraOgMed)} - {formaterDatoForFrontend(periode.tilOgMed)}
              </Table.DataCell>
              <Table.DataCell>{periode.dagsats}</Table.DataCell>
              <Table.DataCell>{periode.gradering}</Table.DataCell>
              <Table.DataCell>{periode.grunnlag}</Table.DataCell>
              <Table.DataCell>{periode.grunnlagsfaktor}</Table.DataCell>
              <Table.DataCell>{periode.grunnbeløp}</Table.DataCell>
              <Table.DataCell>{periode.antallBarn}</Table.DataCell>
              <Table.DataCell>{periode.barnetilleggsats}</Table.DataCell>
              <Table.DataCell>{periode.barnetillegg}</Table.DataCell>
              <Table.DataCell>{formaterDatoForFrontend(periode.utbetalingsdato)}</Table.DataCell>
              <Table.DataCell>{periode.redusertDagsats}</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </VilkårsKort>
  );
};
