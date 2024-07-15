'use client';

import { Label, Table } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BeregningsGrunnlag } from 'lib/types/types';

interface Props {
  grunnlag: BeregningsGrunnlag;
}

export const VisBeregning = ({ grunnlag }: Props) => {
  console.log('grunnlag', grunnlag);
  return (
    <>
      {/* @ts-ignore-line TODO: Legge inn riktig type i backend-typer */}
      <VilkårsKort heading={'Grunnlagsberegning § 11-19'} steg={'VIS_BEREGNING'}>
        <Label>Inntekt siste 3 år</Label>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Periode</Table.HeaderCell>
              <Table.HeaderCell>Inntekt i kr</Table.HeaderCell>
              <Table.HeaderCell>Inntekt i G</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(grunnlag.grunnlag11_19.inntekter).map((key: string) => (
              <Table.Row key={key}>
                <Table.DataCell>{key}</Table.DataCell>
                <Table.DataCell>{grunnlag.grunnlag11_19.inntekter[key]}</Table.DataCell>
                <Table.DataCell></Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </VilkårsKort>
    </>
  );
};
