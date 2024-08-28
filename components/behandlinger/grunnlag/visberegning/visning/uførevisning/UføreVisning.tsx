import React from 'react';
import { UføreGrunnlag } from 'lib/types/types';
import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { Label, Table } from '@navikt/ds-react';
import { formaterTilG } from 'lib/utils/string';
import { UføreInntektTabell } from 'components/uføreinntekttabell/UføreInntektTabell';

interface Props {
  grunnlag?: UføreGrunnlag;
}

export const UføreVisning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for uføre');
  }

  return (
    <div className={'flex-column'}>
      <InntektTabell
        inntekter={grunnlag.inntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        grunnlagBeregnet={grunnlag.grunnlag}
      />

      <UføreInntektTabell
        label={
          'Ufør. Pensjonsgivende inntekt siste 3 år  før arbeidsevne ble ytterligere nedsatt, justert for uføregrad '
        }
        inntekter={grunnlag.uføreInntekter}
        gjennomsnittSiste3år={6}
      />
      <div className={'flex-column'}>
        <Label size={'medium'}>Innbyggers grunnlag er satt til gunstigste av følgende</Label>
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
              <Table.DataCell align={'right'}>{formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}</Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell>Inntekt siste år ({grunnlag.inntektSisteÅr.år})</Table.DataCell>
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
              <Table.HeaderCell scope={'row'}>Grunnlag satt til</Table.HeaderCell>
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
