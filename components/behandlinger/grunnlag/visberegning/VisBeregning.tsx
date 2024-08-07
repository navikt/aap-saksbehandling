'use client';

import { Heading, Label, Table } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BeregningsGrunnlag } from 'lib/types/types';
import styles from 'components/behandlinger/grunnlag/fastsettberegning/Grunnlag1119.module.css';
import { LabelValuePair } from 'components/labelvaluepair/LabelValuePair';
import { Grunnlag1119 } from 'components/behandlinger/grunnlag/fastsettberegning/Grunnlag1119';
import { getJaNeiEllerUndefined } from 'lib/utils/form';

interface Props {
  grunnlag: BeregningsGrunnlag;
}

export const VisBeregning = ({ grunnlag }: Props) => {
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
            {Object.keys(grunnlag?.grunnlag11_19.inntekter ?? {})?.map((key: string) => (
              <Table.Row key={key}>
                <Table.DataCell>{key}</Table.DataCell>
                <Table.DataCell>{grunnlag.grunnlag11_19.inntekter[key]}</Table.DataCell>
                <Table.DataCell></Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <div className={'flex-column'}>
          <Heading size={'small'}>Utregning</Heading>
          <div className={styles.grunnlagvisning}>
            <LabelValuePair label={'Faktagrunnlag'} value={JSON.stringify(grunnlag.faktagrunnlag)} />
            <LabelValuePair label={'Grunnlag'} value={JSON.stringify(grunnlag.grunnlag.verdi)} />
          </div>

          <Heading size={'small'}>Grunnlag 11-19</Heading>
          <Grunnlag1119 grunnlag={grunnlag.grunnlag11_19} />

          {grunnlag.grunnlagUføre && (
            <>
              <Heading size={'small'}>Grunnlag uføre</Heading>
              <div className={styles.grunnlagvisning}>
                <LabelValuePair
                  label={'Er 6G begrenset?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagUføre.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'Er gjennomsnitt?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagUføre.erGjennomsnitt)}
                />

                <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlagUføre.grunnlaget} />
                <LabelValuePair label={'type'} value={grunnlag.grunnlagUføre.type} />
                <LabelValuePair label={'Uføre inntekt i kroner?'} value={grunnlag.grunnlagUføre.uføreInntektIKroner} />
                <LabelValuePair
                  label={'Uføre ytterligere nedsatt arbeidsevn år?'}
                  value={grunnlag.grunnlagUføre.uføreYtterligereNedsattArbeidsevneÅr}
                />
                <LabelValuePair label={'Uføregrad'} value={grunnlag.grunnlagUføre.uføregrad} />
              </div>
              <Heading size={'small'}>Grunnlag Uføre (11-19)</Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagUføre.grunnlag} />
              <Heading size={'small'}>Grunnlag ytterligere nedsatt (11-19)</Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagUføre.grunnlagYtterligereNedsatt} />
            </>
          )}

          {grunnlag.grunnlagYrkesskade && (
            <>
              <Heading size={'small'}>Grunnlag Yrkesskade</Heading>
              <div className={styles.grunnlagvisning}>
                <LabelValuePair
                  label={'Andel som ikke skyldes yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.andelSomIkkeSkyldesYrkesskade}
                />
                <LabelValuePair
                  label={'Andel som skyldes yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.andelSomSkyldesYrkesskade}
                />
                <LabelValuePair label={'Andel yrkesskade?'} value={grunnlag.grunnlagYrkesskade.andelYrkesskade} />
                <LabelValuePair
                  label={'Antatt årlig inntekt yrkesskade tidspunktet?'}
                  value={grunnlag.grunnlagYrkesskade.antattÅrligInntektYrkesskadeTidspunktet}
                />
                <LabelValuePair
                  label={'benyttet andel for yrkesskaden?'}
                  value={grunnlag.grunnlagYrkesskade.benyttetAndelForYrkesskade}
                />
                <LabelValuePair
                  label={'er 6G begrenset?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagYrkesskade.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'er gjennomsnitt?'}
                  value={getJaNeiEllerUndefined(grunnlag.grunnlagYrkesskade.er6GBegrenset)}
                />
                <LabelValuePair
                  label={'Grunnlag etter yrkesskade fordel'}
                  value={grunnlag.grunnlagYrkesskade.grunnlagEtterYrkesskadeFordel}
                />
                <LabelValuePair
                  label={'grunnlag for beregning av yrkesskade andel'}
                  value={grunnlag.grunnlagYrkesskade.grunnlagForBeregningAvYrkesskadeandel}
                />
                <LabelValuePair label={'grunnlaget'} value={grunnlag.grunnlagYrkesskade.grunnlaget} />
                <LabelValuePair
                  label={'terskelverdi for yrkesskade'}
                  value={grunnlag.grunnlagYrkesskade.terskelverdiForYrkesskade}
                />
                <LabelValuePair label={'yrkesskadetidspunkt'} value={grunnlag.grunnlagYrkesskade.yrkesskadeTidspunkt} />
                <LabelValuePair
                  label={'yrkesskade inntekt i G'}
                  value={grunnlag.grunnlagYrkesskade.yrkesskadeinntektIG}
                />
              </div>
              <Heading size={'small'}>grunnlag Yrkesskade (11-19) </Heading>
              <Grunnlag1119 grunnlag={grunnlag.grunnlagYrkesskade.beregningsgrunnlag} />
            </>
          )}
        </div>
      </VilkårsKort>
    </>
  );
};
