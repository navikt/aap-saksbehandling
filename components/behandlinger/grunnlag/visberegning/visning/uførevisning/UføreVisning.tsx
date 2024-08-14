import React from 'react';
import { UføreGrunnlag } from 'lib/types/types';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';
import { formaterTilG } from 'lib/utils/string';

interface Props {
  grunnlag?: UføreGrunnlag;
}

export const UføreVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for uføre</div>;
  }

  return (
    <div className={'flex-column'}>
      <InntektTabell
        label={'Pensjonsgivende inntekt siste 3 år før arbeidsevne ble nedsatt'}
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={6}
      />

      <InntektTabell
        label={
          'Ufør. Pensjonsgivende inntekt siste 3 år  før arbeidsevne ble ytterligere nedsatt, justert for uføregrad '
        }
        inntekter={grunnlag.uføreInntekter}
        gjennomsnittSiste3år={6}
      />
      <div className={'flex-column'}>
        <Label size={'medium'}>Faktisk grunnlag er satt til høyeste verdi av følgende</Label>
        <Table size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'}>Grunnlag</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>Snitt inntekt siste 3 år</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Inntekt siste år</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅr.inntektIG)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Snitt inntekt siste 3 år ufør</Table.DataCell>
              <Table.DataCell align={'right'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3årUfør)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Inntekt siste år ufør</Table.DataCell>
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.inntektSisteÅrUfør.inntektIG)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>
                <b>Faktisk grunnlag</b>
              </Table.DataCell>
              <Table.DataCell align={'right'}>
                <b>{formaterTilG(grunnlag.grunnlag)}</b>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
