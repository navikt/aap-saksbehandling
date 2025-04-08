import { InntektTabell } from 'components/inntekttabell/InntektTabell';
import { BodyShort, Table } from '@navikt/ds-react';

import styles from '../Visning.module.css';
import { Grunnlag1119 } from 'lib/types/types';
import { formaterTilG } from 'lib/utils/string';
import { sorterEtterÅrIStigendeRekkefølge } from 'lib/utils/arrays';
import { TableStyled } from 'components/tablestyled/TableStyled';

interface Props {
  grunnlag?: Grunnlag1119;
}

export const Grunnlag1119Visning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    throw new Error('Kunne ikke finne påkrevd grunnlag for 11-19');
  }

  const sorterteInntekter = sorterEtterÅrIStigendeRekkefølge(grunnlag.inntekter);
  const foersteAar = sorterteInntekter.at(0)?.år;
  const sisteAar = sorterteInntekter.at(-1)?.år;

  return (
    <div className={styles.visning}>
      <InntektTabell
        inntekter={sorterteInntekter}
        gjennomsnittSiste3år={grunnlag.gjennomsnittligInntektSiste3år}
        yrkesevneNedsattÅr={grunnlag.nedsattArbeidsevneÅr}
      />
      <div className={'flex-column'}>
        <BodyShort size={'small'} weight={'semibold'}>
          Brukers grunnlag er satt til det gunstigste av følgende:
        </BodyShort>
        <TableStyled size={'medium'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textSize={'small'}>Beskrivelse</Table.HeaderCell>
              <Table.HeaderCell align={'right'} textSize={'small'}>
                Grunnlag
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell textSize={'small'}>
                § 11-19 {`Gjennomsnitt inntekt siste 3 år (${foersteAar} - ${sisteAar})`}{' '}
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.gjennomsnittligInntektSiste3år)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell textSize={'small'}>
                § 11-19 Inntekt siste år ({grunnlag.inntektSisteÅr.år})
              </Table.DataCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                {formaterTilG(grunnlag.inntektSisteÅr.justertTilMaks6G)}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell scope={'row'} textSize={'small'}>
                Fastsatt grunnlag
              </Table.HeaderCell>
              <Table.DataCell align={'right'} textSize={'small'}>
                <b>{formaterTilG(grunnlag.grunnlag)}</b>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </TableStyled>
      </div>
    </div>
  );
};
