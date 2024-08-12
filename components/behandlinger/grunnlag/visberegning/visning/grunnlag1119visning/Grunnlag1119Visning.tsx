import { Heading, Label, Table } from '@navikt/ds-react';
import { Grunnlag1119 } from 'lib/types/types';

import styles from 'components/behandlinger/grunnlag/visberegning/visning/grunnlag1119visning/Grunnlag1119.module.css';
import { getJaNeiEllerUndefined } from 'lib/utils/form';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';

interface Props {
  grunnlag?: Grunnlag1119;
}

export const Grunnlag1119Visning = ({ grunnlag }: Props) => {
  if (!grunnlag) {
    return <div>Kunne ikke finne påkrevd grunnlag for standard</div>;
  }
  return (
    <>
      <Heading size={'small'}>Grunnlag 11-19</Heading>
      <div className={styles.grunnlagvisning}>
        <LabelValuePair
          label={'Er 6G begrenset?'}
          value={getJaNeiEllerUndefined(grunnlag.er6GBegrenset)}
          tooltip={'Om minst ett av årene fra [inntekter] overstiger 6G'}
        />
        <LabelValuePair
          label={'Er gjennomsnitt?'}
          value={getJaNeiEllerUndefined(grunnlag.erGjennomsnitt)}
          tooltip={'Om [grunnlaget] er et gjennomsnitt'}
        />
        <LabelValuePair
          label={'Grunnlaget'}
          value={grunnlag.grunnlaget}
          tooltip={'Hvilket grunnlag som beregningen skal basere seg utfra §11-19'}
        />

        <div className={styles.grunnlagvisningfullrad}>
          <Label>Inntekt siste 3 år</Label>
          <Table size={'small'}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Inntekt i kr</Table.HeaderCell>
                <Table.HeaderCell>Inntekt i G</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Object.keys(grunnlag?.inntekter ?? {})?.map((key: string) => (
                <Table.Row key={key}>
                  <Table.DataCell>{key}</Table.DataCell>
                  <Table.DataCell>{grunnlag.inntekter[key]}</Table.DataCell>
                  <Table.DataCell></Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};
